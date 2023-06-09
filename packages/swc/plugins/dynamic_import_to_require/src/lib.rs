//! forked from [babel-plugin-dynamic-import-node](https://github.com/airbnb/babel-plugin-dynamic-import-node)
//! but without full compatibility as we intend to use this plugin only with webpack and on server side
//! because of it's performance impact on webpack builds - see related [comment](https://github.com/webpack/webpack/issues/12102#issuecomment-1337109118)

#![allow(clippy::not_unsafe_ptr_arg_deref)]

use if_chain::if_chain;
use swc_core::common::DUMMY_SP;
use swc_core::plugin::{plugin_transform, proxies::TransformPluginProgramMetadata};
use swc_core::{
    ecma::{
        ast::*,
        utils::{private_ident, quote_ident},
        visit::{VisitMut, VisitMutWith},
    },
    quote,
};

struct ReplaceDynamicImport {
    has_dynamic_import: bool,
    helper_ref: Ident,
}

impl ReplaceDynamicImport {
    fn new() -> Self {
        ReplaceDynamicImport {
            has_dynamic_import: false,
            helper_ref: private_ident!("_interopRequireWildcard"),
        }
    }
}

impl VisitMut for ReplaceDynamicImport {
    fn visit_mut_module(&mut self, module: &mut Module) {
        module.visit_mut_children_with(self);

        if self.has_dynamic_import {
            module.body.insert(
                0,
                ModuleItem::ModuleDecl(ModuleDecl::Import(ImportDecl {
                    span: DUMMY_SP,
                    type_only: false,
                    asserts: None,
                    src: Box::new("@swc/helpers".into()),
                    specifiers: vec![ImportSpecifier::Named(ImportNamedSpecifier {
                        span: DUMMY_SP,
                        local: self.helper_ref.clone(),
                        imported: Some(ModuleExportName::Ident(quote_ident!(
                            "_interop_require_wildcard"
                        ))),
                        is_type_only: false,
                    })],
                })),
            );
        }
    }

    fn visit_mut_expr(&mut self, expr: &mut Expr) {
        expr.visit_mut_children_with(self);

        if_chain! {
          if let Expr::Call(call_expr) = expr;
          if let Callee::Import(_) = &call_expr.callee;
          if let Expr::Lit(_) | Expr::Tpl(_) = *call_expr.args[0].expr;
          then {
            self.has_dynamic_import = true;

            *expr = quote!(
              "Promise.resolve().then(() => $helper(require($module)))" as Expr,
              helper: Ident = self.helper_ref.clone(),
              module: Expr = *call_expr.args[0].expr.clone(),
            );
          }
        };
    }
}

#[plugin_transform]
pub fn dynamic_import_to_require(
    mut program: Program,
    _metadata: TransformPluginProgramMetadata,
) -> Program {
    program.visit_mut_with(&mut ReplaceDynamicImport::new());

    program
}

#[cfg(test)]
mod tests {
    use std::path::PathBuf;

    use swc_core::ecma::transforms::testing::test_fixture;
    use swc_core::ecma::visit::as_folder;
    use swc_core::{ecma::transforms::testing::test, testing};
    use swc_ecma_parser::{Syntax, TsConfig};

    use super::*;

    #[testing::fixture("tests/__fixtures__/*.ts")]
    fn fixture_dynamic_import_to_require(input: PathBuf) {
        let output = input.with_extension("js");

        test_fixture(
            Syntax::Typescript(TsConfig {
                tsx: input.to_string_lossy().ends_with(".tsx"),
                ..Default::default()
            }),
            &|_metadata| as_folder(ReplaceDynamicImport::new()),
            &input,
            &output,
            Default::default(),
        );
    }
}
