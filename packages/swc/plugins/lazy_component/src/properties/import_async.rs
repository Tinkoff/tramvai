use swc_core::ecma::{ast::*, utils::quote_ident};

pub fn create_import_async_property(func: &Expr) -> KeyValueProp {
    KeyValueProp {
        key: PropName::Ident(quote_ident!("importAsync")),
        value: Box::new(func.clone()),
    }
}
