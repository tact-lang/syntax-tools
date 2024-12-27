import { tarjan } from "./tarjan";
import * as g from "./transform";

export const sort = (node: g.Grammar) => {
    const graph = walkGrammar(node);
    const components = tarjan(graph);
    const index = components
        .flat()
        .map((name, idx) => [name, idx] as const)
        .reverse();
    const indexObj = Object.fromEntries(index);
    const compare = ({ name: a }: g.Rule, { name: b }: g.Rule) => {
        return (indexObj[a] ?? 0) - (indexObj[b] ?? 0);
    };
    return g.Grammar([...node.rules].sort(compare));
};

const walkGrammar = (node: g.Grammar): Map<string, string[]> => {
    return new Map(node.rules.map(rule => walkRule(rule)));
};

const walkRule = (node: g.Rule): [string, string[]] => {
    const formals = new Set(node.formals);
    const refs = new Set<string>();
    const addRef = (ref: string) => {
        if (!formals.has(ref)) {
            refs.add(ref);
        }
    };
    walkExpression(node.body, addRef);
    return [node.name, [...refs]];
};

const walkExpression = (node: g.Expr, addRef: (ref: string) => void) => {
    const self = (node: g.Expr) => walkExpression(node, addRef);
    const all = (nodes: readonly g.Expr[]) => nodes.forEach(node => self(node));

    switch (node.$) {
        case 'Call':
            addRef(node.name);
            all(node.params);
            return;
        case 'Alt':
        case 'Ap':
        case 'Field':
            self(node.left);
            self(node.right);
            return;
        case 'LookNeg':
        case 'LookPos':
        case 'Optional':
        case 'Plus':
        case 'Star':
        case 'Stringify':
            self(node.expr);
            return;
        case 'Any':
        case 'Class':
        case 'Eps':
        case 'Terminal':
            return;
    }
};