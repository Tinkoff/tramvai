import { withError } from '@tramvai/react';
export const compose = ()=>{
    return (cmp)=>{
        withError()(cmp);
    };
};
