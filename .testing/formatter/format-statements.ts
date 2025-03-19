import {Cst, CstNode} from "../result";
import {childByField, childByType, childLeafWithText, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatExpression} from "./format-expressions";
import {formatAscription} from "./format-types";
import {getCommentsBetween} from "./format-helpers";

export const formatStatements = (code: CodeBuilder, node: CstNode): void => {
    const statements = node.children.filter(it => it.$ === "node");
    if (statements.length === 0) {
        code.add("{}")
        return
    }

    code.add("{").newLine().indent();

    for (const statement of statements) {
        if (statement.type === "Comment") {
            code.add(visit(statement));
        } else if (statement.group === "statement") {
            formatStatement(code, statement);
        }
        code.newLine();
    }

    code.dedent().add("}");
};

export const formatStatement = (code: CodeBuilder, node: Cst): void => {
    if (node.$ !== "node") {
        throw new Error("Expected node in statement");
    }

    switch (node.type) {
        case "StatementLet":
            formatLetStatement(code, node);
            break;
        case "StatementReturn":
            formatReturnStatement(code, node);
            break;
        case "StatementExpression":
            formatExpressionStatement(code, node);
            break;
        case "StatementAssign":
            formatAssignStatement(code, node);
            break;
        case "StatementCondition":
            formatConditionStatement(code, node);
            break;
        case "StatementWhile":
            formatWhileStatement(code, node);
            break;
        case "StatementBlock":
            formatStatements(code, node);
            break;
        default:
            throw new Error(`Unsupported statement type: ${node.type}`);
    }
};

function processInlineComments(node: CstNode, code: CodeBuilder, start: Cst, end: Cst) {
    const comments = getCommentsBetween(node, start, end)
    comments.forEach(comment => {
        code.add(visit(comment))
    })
}

const formatLetStatement = (code: CodeBuilder, node: CstNode): void => {
    const name = childByField(node, "name");
    const type = childByType(node, "type");
    const init = childByField(node, "init");
    const assign = childLeafWithText(node, "=");

    if (!name || !init || !assign) {
        throw new Error("Invalid let statement");
    }

    code.add("let").space().add(visit(name));

    if (type && type.$ === "node") {
        processInlineComments(node, code, name, type);
        formatAscription(code, type);
        processInlineComments(node, code, type, assign);
    } else {
        processInlineComments(node, code, name, assign);
    }

    code.space().add("=").space();
    processInlineComments(node, code, assign, init);

    formatExpression(code, init);
    code.add(";");
};

const formatReturnStatement = (code: CodeBuilder, node: CstNode): void => {
    const returnKeyword = childLeafWithText(node, "return");
    const expression = childByField(node, "expression");
    code.add("return");
    if (expression) {
        code.space();
        processInlineComments(node, code, returnKeyword, expression);
        formatExpression(code, expression);
    }
    code.add(";");
};

const formatExpressionStatement = (code: CodeBuilder, node: CstNode): void => {
    const expression = childByField(node, "expression");
    if (!expression) {
        throw new Error("Invalid expression statement");
    }
    formatExpression(code, expression);
    code.add(";");
};

const formatAssignStatement = (code: CodeBuilder, node: CstNode): void => {
    const left = childByField(node, "left");
    const operator = childByField(node, "operator");
    const assign = childLeafWithText(node, "=");
    const right = childByField(node, "right");

    if (!left || !right || !assign) {
        throw new Error("Invalid assign statement");
    }

    formatExpression(code, left);

    if (operator && operator.$ === "node") {
        code.space().add(visit(operator));
    }

    code.space().add("=").space();
    processInlineComments(node, code, assign, right);

    formatExpression(code, right);
    code.add(";");
};

const formatConditionStatement = (code: CodeBuilder, node: CstNode): void => {
    const ifKeyword = childLeafWithText(node, "if");
    const condition = childByField(node, "condition");
    const trueBranch = childByField(node, "trueBranch");
    const falseBranch = childByType(node, "falseBranch");

    if (!condition || !trueBranch) {
        throw new Error("Invalid condition statement");
    }

    code.add("if").space()
    processInlineComments(node, code, ifKeyword, condition);

    formatExpression(code, condition);
    code.space();

    formatStatements(code, trueBranch);

    if (falseBranch && falseBranch.$ === "node") {
        code.space().add("else").space();

        const branch = falseBranch.children.at(-1)
        if (branch.$ === "leaf") {
            return
        }

        if (branch.type === "StatementCondition") {
            formatConditionStatement(code, branch);
        } else {
            formatStatements(code, branch);
        }
    }
};

const formatWhileStatement = (code: CodeBuilder, node: CstNode): void => {
    const condition = childByField(node, "condition");
    const body = childByField(node, "body");

    if (!condition || !body) {
        throw new Error("Invalid while statement");
    }

    code.add("while").space();
    formatExpression(code, condition);
    code.space();
    formatStatements(code, body);
}; 
