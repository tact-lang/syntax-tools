export const tarjan = <T,>(graph: Map<T, T[]>) => {
    let index = 0;
    type Desc = {index: number, lowlink: number, onStack: boolean};
    const stack: T[] = [];
    const vs = [...new Set([[...graph.keys()], ...graph.values()].flat())];
    const vdata = new Map<T, Desc>();
    const sccs: T[][] = [];
    const loop = (v: T) => {
        const vdesc: Desc = {
            index,
            lowlink: index,
            onStack: true,
        };
        vdata.set(v, vdesc);
        ++index;
        stack.push(v);
        for (const w of graph.get(v) || []) {
            const wdesc = vdata.get(w);
            if (!wdesc) {
                const wdesc = loop(w);
                vdesc.lowlink = Math.min(vdesc.lowlink, wdesc.lowlink);
            } else if (wdesc.onStack) {
                vdesc.lowlink = Math.min(vdesc.lowlink, wdesc.index);
            }
        }
        if (vdesc.lowlink === vdesc.index) {
            const scc: T[] = [];
            for (;;) {
                const w = stack.pop();
                if (typeof w === 'undefined') {
                    throw new Error('Impossible');
                }
                const wdesc = vdata.get(w);
                if (!wdesc) {
                    throw new Error('Impossible');
                }
                wdesc.onStack = false
                scc.push(w);
                if (w === v) break;
            }
            sccs.push(scc);
        }
        return vdesc;
    };
    for (const v of vs) {
        if (!vdata.get(v)) {
            loop(v);
        }
    }
    return sccs;
};
