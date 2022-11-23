const lazy = (imp)=>console.log(imp);
const load = lazy(()=>import('./cmp'));
(async ()=>{
    const { default: cmp  } = await import('./cmp');
    // @TODO: this test generates strange output console.log(cmp as any.actions);
    // might be some problems with config
    console.log(cmp as any.actions);
})();
