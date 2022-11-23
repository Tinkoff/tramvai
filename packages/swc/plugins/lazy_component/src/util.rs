use swc_common::DUMMY_SP;
use swc_core::ecma::ast::*;

pub(crate) fn get_import_arg(call: &CallExpr) -> &Expr {
    &call.args[0].expr
}

pub(crate) fn clone_params(e: &Expr) -> Vec<Param> {
    match e {
        Expr::Fn(f) => f.function.params.clone(),
        Expr::Arrow(f) => f
            .params
            .iter()
            .cloned()
            .map(|pat| Param {
                span: DUMMY_SP,
                pat,
                decorators: Default::default(),
            })
            .collect(),
        _ => Default::default(),
    }
}
