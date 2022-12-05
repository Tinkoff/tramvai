#![allow(clippy::not_unsafe_ptr_arg_deref)] // TODO: issue comes from swc and its macro plugin_transform

use if_chain::if_chain;
use swc_common::DUMMY_SP;
use swc_core::ecma::utils::private_ident;
use swc_core::ecma::{
    ast::*,
    visit::{as_folder, FoldWith, VisitMut, VisitMutWith},
};
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_core::quote;

#[derive(Default)]
pub struct TransformVisitor {
    ref_counter: usize,
    ref_list: Vec<Ident>,
}

impl TransformVisitor {
    pub fn new() -> Self {
        Default::default()
    }
}

impl VisitMut for TransformVisitor {
    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if let Expr::Object(i) = expr {
            let mut has_provide_key = false;
            let mut has_use_key = false;

            for prop_or_spread in i.props.iter() {
                if_chain! {
                    if let PropOrSpread::Prop(prop) = prop_or_spread;
                    if let Prop::KeyValue(key_value) = &**prop;
                    if let PropName::Ident(key) = &key_value.key;
                    then {
                        let value: &str = &key.sym;

                        match value {
                            "useValue" | "useFactory" | "useClass" => { has_use_key = true },
                            "provide" => { has_provide_key = true },
                            _ => {},
                        }
                    }
                }
            }

            if has_provide_key && has_use_key {
                let uniq_ref = format!("_ref{}", self.ref_counter);
                let uniq_ref = private_ident!(uniq_ref);
                self.ref_counter += 1;
                self.ref_list.push(uniq_ref.clone());

                *expr = quote!(
                    "($ref_name = $provider_value,
                     Object.defineProperty($ref_name, '__stack', {
                        enumerable: false,
                        value: new globalThis.Error().stack,
                     }),
                     $ref_name)" as Expr,
                    ref_name: Ident = uniq_ref,
                    provider_value: Expr = expr.clone(),
                );
            }
        }
    }

    fn visit_mut_module(&mut self, module: &mut Module) {
        module.visit_mut_children_with(self);

        if self.ref_list.is_empty() {
            return;
        }

        let ref_declaration = VarDecl {
            span: DUMMY_SP,
            kind: VarDeclKind::Var,
            declare: false,
            decls: self
                .ref_list
                .iter()
                .map(|ref_ident| VarDeclarator {
                    span: DUMMY_SP,
                    name: Pat::Ident(BindingIdent {
                        id: ref_ident.clone(),
                        type_ann: Option::None,
                    }),
                    init: Option::None,
                    definite: false,
                })
                .collect(),
        };

        module.body.insert(
            0,
            ModuleItem::Stmt(Stmt::Decl(Decl::Var(Box::new(ref_declaration)))),
        );
    }
}

#[plugin_transform]
pub fn process_transform(program: Program, _metadata: TransformPluginProgramMetadata) -> Program {
    program.fold_with(&mut as_folder(&mut TransformVisitor::new()))
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
    fn fixture_create_token_pure(input: PathBuf) {
        let output = input.with_extension("js");

        test_fixture(
            Syntax::Typescript(TsConfig {
                tsx: input.to_string_lossy().ends_with(".tsx"),
                decorators: true,
                ..Default::default()
            }),
            &|_metadata| as_folder(TransformVisitor::new()),
            &input,
            &output,
            Default::default(),
        );
    }
}
