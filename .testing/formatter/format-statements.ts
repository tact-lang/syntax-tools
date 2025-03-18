import {Cst, CstNode} from "../result";
import {childByField, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatExpression} from "./format-expressions";
import {formatAscription} from "./format-types";

export const formatStatements = (code: CodeBuilder, node: CstNode): void => {
    code.add("{").newLine().indent();

    // Process all children in order to preserve comments
    for (const child of node.children) {
        if (child.$ === "leaf") {
            if (!/[^\s]/.test(child.text)) continue;
            code.add(child.text);
        } else if (child.type === "Comment") {
            code.add(visit(child));
        } else if (child.group === "statement") {
            formatStatement(code, child);
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

const formatLetStatement = (code: CodeBuilder, node: CstNode): void => {
    const name = childByField(node, "name");
    const type = childByField(node, "type");
    const init = childByField(node, "init");

    if (!name || !init) {
        throw new Error("Invalid let statement");
    }

    code.add("let").space().add(visit(name));

    if (type) {
        formatAscription(code, type);
    }

    code.space().add("=").space();
    formatExpression(code, init);
    code.add(";");
};

const formatReturnStatement = (code: CodeBuilder, node: CstNode): void => {
    const expression = childByField(node, "expression");
    code.add("return");
    if (expression) {
        code.space();
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
    const right = childByField(node, "right");

    if (!left || !right) {
        throw new Error("Invalid assign statement");
    }

    formatExpression(code, left);
    if (operator && operator.$ === "node") {
        code.space().add(visit(operator));
    }
    code.space().add("=").space();
    formatExpression(code, right);
    code.add(";");
};

const formatConditionStatement = (code: CodeBuilder, node: CstNode): void => {
    const condition = childByField(node, "condition");
    const trueBranch = childByField(node, "trueBranch");
    const falseBranch = childByField(node, "falseBranch");

    if (!condition || !trueBranch) {
        throw new Error("Invalid condition statement");
    }

    code.add("if").space();
    formatExpression(code, condition);
    code.space();
    formatStatements(code, trueBranch);

    if (falseBranch) {
        code.space().add("else").space();
        if (falseBranch.type === "StatementCondition") {
            formatConditionStatement(code, falseBranch);
        } else {
            formatStatements(code, falseBranch);
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
