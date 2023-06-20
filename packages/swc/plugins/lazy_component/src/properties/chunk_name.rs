use once_cell::sync::Lazy;
use swc_common::{
    comments::{Comment, CommentKind, Comments},
    Spanned, DUMMY_SP,
};
use swc_core::ecma::{
    ast::*,
    utils::{quote_ident, ExprFactory},
};

use crate::util;
use crate::webpack;

const WEBPACK_COMMENT_CHUNK_NAME: &str = "webpackChunkName";

static JS_PATH_REGEXP: Lazy<regex::Regex> =
    Lazy::new(|| regex::Regex::new(r"^[./]+|(\.js$)").unwrap());

static WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX: Lazy<regex::Regex> =
    Lazy::new(|| regex::Regex::new(r"[^a-zA-Z0-9_!§$()=\-^°]+").unwrap());

static WEBPACK_MATCH_PADDED_HYPHENS_REPLACE_REGEX: Lazy<regex::Regex> =
    Lazy::new(|| regex::Regex::new(r"^-|-$").unwrap());

static MATCH_LEFT_HYPHENS_REPLACE_REGEX: Lazy<regex::Regex> =
    Lazy::new(|| regex::Regex::new(r"^-").unwrap());

fn combine_expression(node: &Tpl) -> Expr {
    if node.exprs.len() == 1 {
        return node.exprs[0].as_ref().clone();
    }

    node.exprs
        .iter()
        .skip(1)
        .cloned()
        .fold(node.exprs[0].as_ref().clone(), |r, p| {
            r.make_bin(op!(bin, "+"), *p)
        })
}

fn is_aggressive_import(import: &CallExpr) -> bool {
    let import_arg = util::get_import_arg(import);
    match import_arg {
        Expr::Tpl(t) => !t.exprs.is_empty(),
        _ => false,
    }
}

fn sanitize_chunk_name_template_literal(node: Expr) -> Expr {
    Expr::Call(CallExpr {
        span: DUMMY_SP,
        callee: node.make_member(quote_ident!("replace")).as_callee(),
        args: vec![
            Lit::Regex(Regex {
                span: DUMMY_SP,
                exp: WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX.as_str().into(),
                flags: "g".into(),
            })
            .as_arg(),
            "-".as_arg(),
        ],
        type_args: Default::default(),
    })
}

fn chunk_name_from_template_literal(node: &Expr) -> String {
    match node {
        Expr::Tpl(t) => {
            let v1 = t.quasis[0].cooked.clone().unwrap_or_default();
            if t.exprs.is_empty() {
                return v1.to_string();
            }

            format!("{}[request]", v1)
        }
        _ => unreachable!(),
    }
}

fn module_to_chunk(s: &str) -> String {
    tracing::debug!("module_to_chunk: `{}`", s);

    let s = JS_PATH_REGEXP.replace_all(s, "");
    let s = WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX.replace_all(&s, "-");
    let s = WEBPACK_MATCH_PADDED_HYPHENS_REPLACE_REGEX.replace_all(&s, "");

    tracing::debug!("module_to_chunk: result: `{}`", s);

    s.into_owned()
}

fn replace_quasi(s: &str, strip_left_hyphen: bool) -> String {
    tracing::debug!("replace_quasi: `{}`", s);

    if s.is_empty() {
        return Default::default();
    }
    let s = WEBPACK_PATH_NAME_NORMALIZE_REPLACE_REGEX.replace_all(s, "-");

    if strip_left_hyphen {
        let s = MATCH_LEFT_HYPHENS_REPLACE_REGEX.replace_all(&s, "");

        tracing::debug!("replace_quasi: result: `{}`", s);

        s.into()
    } else {
        tracing::debug!("replace_quasi: result: `{}`", s);

        s.into()
    }
}

fn transform_quasi(quasi: &TplElement, first: bool, single: bool) -> TplElement {
    TplElement {
        span: quasi.span,
        tail: quasi.tail,
        cooked: quasi.cooked.as_ref().map(|cooked| {
            if single {
                module_to_chunk(cooked).into()
            } else {
                replace_quasi(cooked, first).into()
            }
        }),
        raw: if single {
            module_to_chunk(&quasi.raw).into()
        } else {
            replace_quasi(&quasi.raw, first).into()
        },
    }
}

fn get_chunk_name_prefix(chunk_name: Option<&str>) -> Option<String> {
    let chunk_name = match chunk_name {
        Some(s) => s,
        _ => return Default::default(),
    };

    if let Some(idx) = chunk_name.find("[request]") {
        return Some(chunk_name[..idx].into());
    }

    if let Some(idx) = chunk_name.find("[index]") {
        return Some(chunk_name[..idx].into());
    }

    Default::default()
}

struct CommentParser<'a, C: Comments> {
    comments: &'a C,
}

impl<'a, C: Comments> CommentParser<'a, C> {
    fn get_chunk_name_content(&self, import_arg: &Expr) -> Option<String> {
        if !self.comments.has_leading(import_arg.span_lo()) {
            return None;
        }

        self.comments
            .with_leading(import_arg.span_lo(), |comments| {
                comments
                    .iter()
                    .find(|c| c.text.contains(WEBPACK_COMMENT_CHUNK_NAME))
                    .map(|v| v.text.to_string())
            })
    }

    fn get_raw_chunk_name_from_comments(&self, import_arg: &Expr) -> Option<serde_json::Value> {
        let chunk_name_comment = self.get_chunk_name_content(import_arg);

        chunk_name_comment.map(|v| webpack::read_webpack_comment(&v))
    }

    fn get_existing_chunk_name_comment(&self, import: &CallExpr) -> Option<serde_json::Value> {
        let import_arg = util::get_import_arg(import);

        self.get_raw_chunk_name_from_comments(import_arg)
    }

    fn generate_chunk_name_node(&self, import: &CallExpr, prefix: Option<String>) -> Expr {
        let import_arg = util::get_import_arg(import);

        if let Expr::Tpl(import_arg) = import_arg {
            return prefix
                .map(|prefix| {
                    prefix.make_bin(
                        op!(bin, "+"),
                        sanitize_chunk_name_template_literal(combine_expression(import_arg)),
                    )
                })
                .unwrap_or_else(|| {
                    Expr::Tpl(Tpl {
                        span: DUMMY_SP,
                        exprs: import_arg.exprs.clone(),
                        quasis: import_arg
                            .quasis
                            .iter()
                            .enumerate()
                            .map(|(idx, quasi)| {
                                transform_quasi(quasi, idx == 0, import_arg.quasis.len() == 1)
                            })
                            .collect(),
                    })
                });
        }

        let value = match import_arg {
            Expr::Lit(Lit::Str(s)) => s.value.clone(),
            _ => return "".into(),
        };
        module_to_chunk(&value).into()
    }

    fn add_or_replace_chunk_name_comment(&self, import: &CallExpr, values: serde_json::Value) {
        let import_arg = util::get_import_arg(import);

        let chunk_name_content = self.get_chunk_name_content(import_arg);
        if chunk_name_content.is_some() {
            let comments = self.comments.take_leading(import_arg.span_lo());

            if let Some(mut comments) = comments {
                comments.retain(|c| !c.text.contains(WEBPACK_COMMENT_CHUNK_NAME));
                self.comments
                    .add_leading_comments(import_arg.span_lo(), comments)
            }
        }

        self.comments.add_leading(
            import_arg.span_lo(),
            Comment {
                kind: CommentKind::Block,
                span: DUMMY_SP,
                text: webpack::generate_webpack_comment(values).into(),
            },
        )
    }

    fn replace_chunk_name(&self, import: &CallExpr) -> Expr {
        let aggressive_import = is_aggressive_import(import);
        let values = self.get_existing_chunk_name_comment(import);

        tracing::debug!("Values: {:#?}", values);

        let mut webpack_chunk_name = values
            .as_ref()
            .map(|map| {
                map[WEBPACK_COMMENT_CHUNK_NAME]
                    .as_str()
                    .map(|v| v.to_string())
            })
            .unwrap_or_default();

        if !aggressive_import {
            if let Some(values) = values {
                self.add_or_replace_chunk_name_comment(import, values);
                return webpack_chunk_name.unwrap().into();
            }
        }

        let mut chunk_name_node = self
            .generate_chunk_name_node(import, get_chunk_name_prefix(webpack_chunk_name.as_deref()));

        if chunk_name_node.is_tpl() {
            webpack_chunk_name = Some(chunk_name_from_template_literal(&chunk_name_node));
            chunk_name_node = sanitize_chunk_name_template_literal(chunk_name_node);
        } else if let Expr::Lit(Lit::Str(s)) = &chunk_name_node {
            webpack_chunk_name = Some(s.value.to_string());
        }
        let mut values = values.unwrap_or_default();

        if let Some(webpack_chunk_name) = webpack_chunk_name {
            values[WEBPACK_COMMENT_CHUNK_NAME] = serde_json::Value::String(webpack_chunk_name);
        }

        self.add_or_replace_chunk_name_comment(import, values);
        chunk_name_node
    }
}

pub fn create_chunk_name_method(
    comments: &impl Comments,
    import: &CallExpr,
    func: &Expr,
) -> MethodProp {
    let comment_parser = CommentParser { comments };
    let chunk_name = comment_parser.replace_chunk_name(import);

    MethodProp {
        key: PropName::Ident(quote_ident!("chunkName")),
        function: Box::new(Function {
            params: util::clone_params(func),
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(BlockStmt {
                span: DUMMY_SP,
                stmts: vec![Stmt::Return(ReturnStmt {
                    span: DUMMY_SP,
                    arg: Some(Box::new(chunk_name)),
                })],
            }),
            is_generator: false,
            is_async: false,
            type_params: Default::default(),
            return_type: Default::default(),
        }),
    }
}
