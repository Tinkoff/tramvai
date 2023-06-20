mod properties;
mod util;
mod webpack;

use if_chain::if_chain;
use swc_common::{comments::Comments, DUMMY_SP};
use swc_core::{
    ecma::{
        ast::*,
        utils::ExprFactory,
        visit::{Visit, VisitMut, VisitMutWith, VisitWith},
    },
    plugin::{
        plugin_transform,
        proxies::{PluginCommentsProxy, TransformPluginProgramMetadata},
    },
};

fn is_supported(e: &Expr) -> bool {
    match e {
        Expr::Paren(e) => is_supported(&e.expr),
        Expr::Fn(..) | Expr::Arrow(..) => true,
        _ => false,
    }
}

struct LazyComponent<C: Comments> {
    comments: C,
    lazy_component_local_name: Option<String>,
}

impl<C: Comments> LazyComponent<C> {
    fn new(comments: C) -> Self {
        LazyComponent {
            comments,
            lazy_component_local_name: None,
        }
    }

    fn create_object_from(&mut self, import: &CallExpr, func: &Expr) -> Expr {
        ObjectLit {
            span: DUMMY_SP,
            props: vec![
                PropOrSpread::Prop(Box::new(Prop::Method(
                    properties::create_chunk_name_method(&self.comments, import, func),
                ))),
                PropOrSpread::Prop(Box::new(Prop::Method(
                    properties::create_require_sync_method(),
                ))),
                PropOrSpread::Prop(Box::new(Prop::Method(properties::create_is_ready_method()))),
                PropOrSpread::Prop(Box::new(Prop::KeyValue(
                    properties::create_import_async_property(func),
                ))),
                PropOrSpread::Prop(Box::new(Prop::Method(
                    properties::create_require_async_method(),
                ))),
                PropOrSpread::Prop(Box::new(Prop::Method(properties::create_resolve_method(
                    import, func,
                )))),
            ],
        }
        .into()
    }

    fn transform_import_expr(&mut self, call: &mut CallExpr) {
        let import = {
            let mut v = ImportFinder::default();

            call.visit_with(&mut v);

            match v.import {
                Some(v) => v,
                None => return,
            }
        };

        if call.args.is_empty() {
            return;
        }

        let expr = &call.args[0].expr;

        if is_supported(expr) {
            let object = self.create_object_from(&import, &call.args[0].expr);
            call.args[0] = object.as_arg();
        }
    }
}

impl<C: Comments> VisitMut for LazyComponent<C> {
    fn visit_mut_import_decl(&mut self, import: &mut ImportDecl) {
        if self.lazy_component_local_name.is_some() {
            return;
        }

        let ImportDecl {
            src, specifiers, ..
        } = import;
        let name: &str = &src.value;

        if name == "@tramvai/react" {
            tracing::debug!("Has `@tramvai/react` import");
            for specifier in specifiers {
                if_chain! {
                  if let ImportSpecifier::Named(named_specifier) = specifier;
                  let ident = if let Some(ModuleExportName::Ident(ident)) = &named_specifier.imported {
                    ident
                  } else {
                    &named_specifier.local
                  };
                  if &ident.sym == "lazy";
                  then {
                    let name = named_specifier.local.sym.to_string();
                    tracing::debug!("Local import name: {}", &name);

                    self.lazy_component_local_name = Some(name);
                    return;
                  }
                };
            }
        }
    }

    fn visit_mut_call_expr(&mut self, call: &mut CallExpr) {
        if let Some(local_name) = &self.lazy_component_local_name {
            if_chain! {
              if let Callee::Expr(callee) = &call.callee;
              if let Expr::Ident(ident) = &**callee;
              if &ident.sym == local_name;
              then {
                self.transform_import_expr(call)
              } else {

                call.visit_mut_children_with(self);
                }
            };
        }
    }
}

#[derive(Default)]
struct ImportFinder {
    import: Option<CallExpr>,
}

impl Visit for ImportFinder {
    fn visit_call_expr(&mut self, call: &CallExpr) {
        if let Callee::Import(..) = &call.callee {
            if self.import.is_some() {
                panic!(
                    "lazy-component: multiple import calls inside `lazy()` function are not \
                         supported."
                );
            }

            self.import = Some(call.clone());
        } else {
            call.visit_children_with(self);
        }
    }
}

#[plugin_transform]
fn loadable_components_plugin(
    mut program: Program,
    _data: TransformPluginProgramMetadata,
) -> Program {
    program.visit_mut_with(&mut LazyComponent::new(PluginCommentsProxy));

    program
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use swc_core::ecma::transforms::testing::test_fixture;
    use swc_core::{
        ecma::{transforms::testing::test, visit::as_folder},
        testing,
    };
    use swc_ecma_parser::{Syntax, TsConfig};

    use super::*;

    #[testing::fixture("tests/__fixtures__/*.ts")]
    fn fixture_lazy_component(input: PathBuf) {
        let output = input.with_extension("js");

        test_fixture(
            Syntax::Typescript(TsConfig {
                tsx: input.to_string_lossy().ends_with(".tsx"),
                ..Default::default()
            }),
            &|metadata| as_folder(LazyComponent::new(metadata.comments.clone())),
            &input,
            &output,
            Default::default(),
        );
    }
}
