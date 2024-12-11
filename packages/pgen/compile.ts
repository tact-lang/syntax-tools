import * as t from '@babel/types';
import * as g from "./transform";

const rtGlobal = '$';
const astGlobal = '$$';

export const compile = (node: g.Grammar): t.File => {
    const imports: t.Statement[] = [
        emitNsImport(rtGlobal, '@langtools/runtime'),
    ];

    const definedRules = new Set<string>();
    const isDefined = (name: string) => definedRules.has(name);

    const stmts: t.Statement[] = [];
    const ast: t.Statement[] = [];
    for (const rule of node.rules) {
        const { expr, type } = compileRule(rule)({ isDefined });
        stmts.push(expr);
        ast.push(type);
        definedRules.add(rule.name);
    }

    return t.file(t.program([
        ...imports,
        t.exportNamedDeclaration(t.tsModuleDeclaration(
            t.identifier(astGlobal),
            t.tsModuleBlock(ast),
        )),
        ...stmts,
    ]));
};

type Context = {
    isDefined: (name: string) => boolean;
}
type Compiler<T> = (ctx: Context) => T;

const compileRule = ({ name, formals, body }: g.Rule): Compiler<{
    expr: t.Statement,
    type: t.Statement,
}> => ctx => {
    const nameCode = formals.length === 0
        ? withType(t.identifier(name), emitParserType(name, []))
        : t.identifier(name);

    const { expr: exprCode, type: typeCode } = compileExpr(body)(ctx);

    const bodyCode = compileFormals(name, formals, exprCode);
    
    return {
        expr: t.exportNamedDeclaration(t.variableDeclaration('const', [
            t.variableDeclarator(nameCode, bodyCode)
        ])),
        type: t.exportNamedDeclaration(t.tsTypeAliasDeclaration(
            t.identifier(name),
            formals.length > 0
                ? t.tsTypeParameterDeclaration(
                    formals.map(formal => t.tsTypeParameter(null, null, formal))
                )
                : null,
            typeCode,
        ))
    };
};

const compileFormals = (name: string, formals: readonly string[], bodyCode: t.Expression): t.Expression => {
    if (formals.length === 0) {
        return bodyCode;
    }

    const functionParams = formals.map(formal => {
        return withType(t.identifier(formal), emitParserType(formal, [], true));
    });

    const arrow = t.arrowFunctionExpression(functionParams, bodyCode);

    arrow.typeParameters = t.tsTypeParameterDeclaration(formals.map(formal => {
        return t.tsTypeParameter(null, null, formal);
    }));

    arrow.returnType = t.tsTypeAnnotation(emitParserType(name, formals))

    return arrow;
};

type ExprWithType = {
    readonly expr: t.Expression,
    readonly type: t.TSType,
}
const ewt = (expr: t.Expression, type: t.TSType): ExprWithType => ({ expr, type });

const compileExpr = (node: g.Expr): Compiler<ExprWithType> => ctx => {
    switch (node.$) {
        case 'Call':
            return compileCall(node)(ctx);
        case 'Field':
            return compileField(node)(ctx);
        case 'Pure':
            return compilePure(node)(ctx);
        case 'Ap':
            return compileAp(node)(ctx);
        case 'Eps':
            return compileEps(node)(ctx);
        case 'LookNeg':
            return compileLookNeg(node)(ctx);
        case 'LookPos':
            return compileLookPos(node)(ctx);
        case 'Optional':
            return compileOptional(node)(ctx);
        case 'Plus':
            return compilePlus(node)(ctx);
        case 'Star':
            return compileStar(node)(ctx);
        case 'Stringify':
            return compileStringify(node)(ctx);
        case 'Alt':
            return compileAlt(node)(ctx);
        case 'Class':
            return compileClass(node)(ctx);
        case 'Terminal':
            return compileTerminal(node)(ctx);
        case 'Any':
            return compileAny(node)(ctx);
    }
};

const compileField = (node: g.Field): Compiler<ExprWithType> => ctx => {
    const left = compileExpr(node.left)(ctx);
    const right = compileExpr(node.right)(ctx);
    
    const body = emitCall('field', [left.expr, t.stringLiteral(node.key), right.expr]);
    
    if (!t.isTSTypeLiteral(right.type)) {
        throw new Error('Bug! Field can only extend object');
    }

    const newProp = t.tsPropertySignature(
        t.identifier(node.key),
        t.tsTypeAnnotation(left.type),
    );

    newProp.readonly = true;

    const type = t.tsTypeLiteral([
        newProp,
        ...right.type.members,
    ]);

    return ewt(body, type);
};

const compilePure = ({ value }: g.Pure): Compiler<ExprWithType> => _ctx => {
    return ewt(
        emitCall('pure', [t.stringLiteral(value)]),
        t.tsLiteralType(t.stringLiteral(value)),
    );
};

const compileEps = (_node: g.Eps): Compiler<ExprWithType> => _ctx => {
    return ewt(emitPrim('eps'), t.tsTypeLiteral([]));
};

const modeToName = {
    l: 'left',
    r: 'right',
} as const;

const compileAp = (node: g.Ap): Compiler<ExprWithType> => ctx => {
    const left = compileExpr(node.left)(ctx);
    const right = compileExpr(node.right)(ctx);
    return ewt(
        emitCall(modeToName[node.mode], [left.expr, right.expr]),
        node.mode === 'l' ? left.type : right.type
    );
};

const compileAlt = (node: g.Alt): Compiler<ExprWithType> => ctx => {
    const left = compileExpr(node.left)(ctx);
    const right = compileExpr(node.right)(ctx);
    return ewt(emitCall('alt', [left.expr, right.expr]), t.tsUnionType([left.type, right.type]));
};

const compileAny = (_node: g.Any): Compiler<ExprWithType> => _ctx => {
    return ewt(emitPrim('any'), t.tsStringKeyword());
};

const compileTerminal = (node: g.Terminal): Compiler<ExprWithType> => ctx => {
    const body = node.value.map(char => compileChar(char)).join('');
    const value = JSON.parse(`"${body}"`);
    const wrapped = t.stringLiteral(value);
    return ewt(emitCall('str', [wrapped]), t.tsLiteralType(t.stringLiteral(value)));
};

const compileClass = ({ insensitive, negated, seqs }: g.Class): Compiler<ExprWithType> => ctx => {
    const prefix = negated ? "^" : "";
    const children = seqs.map(seq => compileSeq(seq));
    const body = children.map(child => child.expr).join('');
    const types = children.map(child => child.type);
    return ewt(
        emitCall(
            'regex',
            [t.stringLiteral(prefix + body), t.booleanLiteral(insensitive)],
            [t.tsUnionType(types)]
        ),
        t.tsUnionType(types),
    );
};

const compileStringify = (node: g.Stringify): Compiler<ExprWithType> => ctx => {
    const { expr } = compileExpr(node.expr)(ctx);
    return ewt(emitCall('stry', [expr]), t.tsStringKeyword());
};

const compilePlus = (node: g.Plus): Compiler<ExprWithType> => ctx => {
    const { expr, type } = compileExpr(node.expr)(ctx);
    const array = t.tsTypeOperator(t.tsArrayType(type))
    array.operator = 'readonly';
    return ewt(emitCall('plus', [expr]), array);
};

const compileStar = (node: g.Star): Compiler<ExprWithType> => ctx => {
    const { expr, type } = compileExpr(node.expr)(ctx);
    const array = t.tsTypeOperator(t.tsArrayType(type))
    array.operator = 'readonly';
    return ewt(emitCall('star', [expr]), array);
};

const compileOptional = (node: g.Optional): Compiler<ExprWithType> => ctx => {
    const { expr, type } = compileExpr(node.expr)(ctx);
    return ewt(emitCall('opt', [expr]), t.tsUnionType([type, t.tsUndefinedKeyword()]));
};

const compileLookPos = (node: g.LookPos): Compiler<ExprWithType> => ctx => {
    const { expr, type } = compileExpr(node.expr)(ctx);
    return ewt(emitCall('lookPos', [expr]), type);
};

const compileLookNeg = (node: g.LookNeg): Compiler<ExprWithType> => ctx => {
    const { expr } = compileExpr(node.expr)(ctx);
    return ewt(emitCall('lookNeg', [expr]), t.tsUndefinedKeyword());
};

const compileCall = (node: g.Call): Compiler<ExprWithType> => ctx => {
    const wrapInRef = (name: string, expr: t.Expression) => {
        if (ctx.isDefined(name)) {
            return expr;
        } else {
            return t.callExpression(emitPrim('ref'), [t.arrowFunctionExpression([], expr)]);
        }
    };

    const params = node.params.map(param => compileExpr(param)(ctx));

    const body = node.params.length > 0
        ? t.callExpression(
            t.identifier(node.name),
            params.map(param => param.expr),
        )
        : t.identifier(node.name);

    const type = t.tsTypeReference(
        t.identifier(node.name),
        node.params.length > 0
            ? t.tsTypeParameterInstantiation(
                params.map(param => param.type)
            )
            : null
    );

    return ewt(wrapInRef(node.name, body), type);
};

type TypedString = { expr: string, type: t.TSType };

const compileChar = (node: g.Escape | g.Special | g.Char): string => {
    switch (node.$) {
        case 'Char':
            return node.value;
        default:
            return compileEscape(node).expr;
    }
};

const compileSeq = (node: g.Group | g.ClassChar | g.SpecialClass | g.Escape): TypedString => {
    switch (node.$) {
        case 'Group':
            return {
                expr: compileSeq(node.from).expr + '-' + compileSeq(node.to).expr,
                type: t.tsStringKeyword(),
            };
        case 'ClassChar':
            return {
                expr: node.value === '\\' || node.value === '\]'
                    ? `\\${node.value}`
                    : node.value,
                type: t.tsLiteralType(t.stringLiteral(node.value)),
            };
        default:
            return compileEscape(node);
    }
};

const compileEscape = (node: g.Escape | g.Special | g.SpecialClass): TypedString => {
    let expr = compileEscapeToString(node);

    const str = `"${expr}"`;

    const type = (() => {
        try {
            return t.tsLiteralType(t.stringLiteral(JSON.parse(str)));
        } catch (e) {
            return t.tsStringKeyword();
        }
    })();

    return {
        expr,
        type,
    };
};

const compileEscapeToString = (node: g.Escape | g.Special | g.SpecialClass): string => {
    switch (node.$) {
        case 'Ascii':
            return `\\x${node.value}`;
        case 'Short':
            return `\\u${node.value}`;
        case 'Long':
            return `\\u{${node.value}}`;
        case 'Named':
            return `\\${node.value}`;
        case 'Special':
        case 'SpecialClass':
            return `\\${node.value}`;
    }
};

const emitCall = (name: string, args: t.Expression[], params?: t.TSType[]): t.Expression => {
    const result = t.callExpression(emitPrim(name), args);
    if (params && params.length > 0) {
        result.typeParameters = t.tsTypeParameterInstantiation(params);
    }
    return result;
};

const emitPrim = (name: string): t.Expression => {
    return t.memberExpression(t.identifier(rtGlobal), t.identifier(name));
};

const emitParserType = (name: string, formals: readonly string[], notQualified: boolean = false): t.TSType => {
    const typeParams = formals.length === 0
        ? null
        : t.tsTypeParameterInstantiation(formals.map(formal => {
            return t.tsTypeReference(t.identifier(formal));
        }));
    return t.tsTypeReference(
        t.tsQualifiedName(t.identifier(rtGlobal), t.identifier('Parser')),
        t.tsTypeParameterInstantiation([
            t.tsTypeReference(
                notQualified
                    ? t.identifier(name)
                    : t.tsQualifiedName(t.identifier(astGlobal), t.identifier(name)),
                typeParams,
            )
        ])
    );
};

const emitNsImport = (name: string, from: string): t.ImportDeclaration => {
    return t.importDeclaration(
        [t.importNamespaceSpecifier(t.identifier(name))],
        t.stringLiteral(from),
    );
};

const withType = <U extends t.Identifier>(value: U, type: t.TSType): U => {
    value.typeAnnotation = t.tsTypeAnnotation(type);
    return value;
};
