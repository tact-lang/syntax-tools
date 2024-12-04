export const tarjan = (graph) => {
    let index = 0;
    const stack = [];
    const vs = [...new Set([[...graph.keys()], ...graph.values()].flat())];
    const vdata = new Map();
    const sccs = [];
    const loop = (v) => {
        const vdesc = {
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
            }
            else if (wdesc.onStack) {
                vdesc.lowlink = Math.min(vdesc.lowlink, wdesc.index);
            }
        }
        if (vdesc.lowlink === vdesc.index) {
            const scc = [];
            for (;;) {
                const w = stack.pop();
                if (typeof w === 'undefined') {
                    throw new Error('Impossible');
                }
                const wdesc = vdata.get(w);
                if (!wdesc) {
                    throw new Error('Impossible');
                }
                wdesc.onStack = false;
                scc.push(w);
                if (w === v)
                    break;
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
