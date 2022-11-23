use swc_common::DUMMY_SP;
use swc_core::{
    ecma::{ast::*, utils::quote_ident},
    quote,
};

pub fn create_require_async_method() -> MethodProp {
    MethodProp {
        key: PropName::Ident(quote_ident!("requireAsync")),
        function: Box::new(Function {
            params: vec![Param {
                span: DUMMY_SP,
                decorators: Default::default(),
                pat: Pat::Ident(quote_ident!("props").into()),
            }],
            decorators: Default::default(),
            span: DUMMY_SP,
            body: Some(
                quote!(
                    "
                  {
                    return this.importAsync(props).then(resolved => {
                     return resolved;
                    });
                  }
                  " as Stmt
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
