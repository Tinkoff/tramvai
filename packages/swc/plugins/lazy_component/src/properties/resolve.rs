use crate::util;
use swc_common::DUMMY_SP;
use swc_core::{
    ecma::{ast::*, utils::quote_ident},
    quote,
};

pub fn create_resolve_method(import: &CallExpr, func: &Expr) -> MethodProp {
    MethodProp {
        key: PropName::Ident(quote_ident!("resolve")),
        function: Box::new(Function {
            params: util::clone_params(func),
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(
                quote!(
                    "
                  {
                    return require.resolveWeak($id)
                  }
                  " as Stmt,
                    id: Expr = util::get_import_arg(import).clone()
                )
                .expect_block(),
            ),
            is_generator: false,
            is_async: false,
            type_params: Default::default(),
            return_type: Default::default(),
        }),
    }
}
