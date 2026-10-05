export function traceCopy(locale:"en"|"es",key:string){const es=locale==="es";return ({pass:es?"pasa":"pass",fail:es?"falla":"fail","needs-review":es?"requiere revisión":"needs review"}[key]??key);}
