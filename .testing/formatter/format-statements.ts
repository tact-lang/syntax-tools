import {Cst, CstNode} from "../result";
import {childByField, childByType, childLeafWithText, visit} from "../cst-helpers";
import {CodeBuilder} from "../code-builder";
import {formatExpression} from "./format-expressions";
import {formatAscription, formatType} from "./format-types";
import {getCommentsBetween, idText} from "./format-helpers";

function trailingNewlines(node: CstNode): string {
    const lastChild = node.children.at(-1)
    if (lastChild.$ === "leaf" && lastChild.text.includes("\n")) {
        return lastChild.text
    }
    return ""
}

function containsSeveralNewlines(text: string): boolean {
    const index = text.indexOf("\n")
    if (index === -1) {
        return false
    }
    return text.substring(index + 1).includes("\n")
}

export const formatStatements = (code: CodeBuilder, node: CstNode): void => {
    const statements = node.children.filter(it => it.$ === "node");
    if (statements.length === 0) {
        code.add("{}")
        return
    }

    code.add("{").newLine().indent();

    let needNewLine = false
    for (const statement of node.children) {
        if (statement.$ === "leaf") {
            if (containsSeveralNewlines(statement.text)) {
                needNewLine = true;
            }
            continue
        }

        if (needNewLine) {
            code.newLine();
            needNewLine = false
        }

        if (statement.type === "Comment") {
            code.add(visit(statement));
        } else if (statement.group === "statement") {
            formatStatement(code, statement);
            const newlines = trailingNewlines(statement)
            if (containsSeveralNewlines(newlines)) {
                needNewLine = true
            }
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
        case "StatementDestruct":
            formatDestructStatement(code, node);
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
        case "StatementRepeat":
            formatRepeatStatement(code, node);
            break;
        case "StatementUntil":
            formatUntilStatement(code, node);
            break;
        case "StatementTry":
            formatTryStatement(code, node);
            break;
        case "StatementForEach":
            formatForEachStatement(code, node);
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
    const type = childByField(node, "type");
    const init = childByField(node, "init");
    const assign = childLeafWithText(node, "=");

    if (!name || !init || !assign) {
        throw new Error("Invalid let statement");
    }

    code.add("let").space().add(idText(name));

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

    code.space()
    if (operator && operator.$ === "node") {
        code.add(visit(operator));
    }

    code.add("=").space();
    processInlineComments(node, code, assign, right);

    formatExpression(code, right);
    code.add(";");
};

const formatConditionStatement = (code: CodeBuilder, node: CstNode): void => {
    const ifKeyword = childLeafWithText(node, "if");
    const condition = childByField(node, "condition");
    const trueBranch = childByField(node, "trueBranch");
    const falseBranch = childByField(node, "falseBranch");

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

const formatDestructStatement = (code: CodeBuilder, node: CstNode): void => {
    const type = childByField(node, "type");
    const fields = childByField(node, "fields");
    const rest = childByType(node, "RestArgument");
    const assign = childLeafWithText(node, "=");
    const init = childByField(node, "init");

    if (!type || !fields || !assign || !init) {
        throw new Error("Invalid destruct statement");
    }

    code.add("let").space();
    formatType(code, type);
    code.space().add("{").space();

    const fieldsNode = fields.children.filter(field => field.$ === "node");
    fieldsNode.forEach((field, index) => {
        if (field.type === "RegularField") {
            const fieldName = childByField(field, "fieldName");
            const varName = childByField(field, "varName");
            if (!fieldName || !varName) {
                throw new Error("Invalid regular field in destruct");
            }
            code.add(idText(fieldName)).add(":").space().add(idText(varName));
        } else if (field.type === "PunnedField") {
            const name = childByField(field, "name");
            if (!name) {
                throw new Error("Invalid punned field in destruct");
            }
            code.add(idText(name));
        }
        if (index < fieldsNode.length - 1) {
            code.add(",").space();
        }
    });

    if (rest && rest.$ === "node" && rest.type === "RestArgument") {
        if (fieldsNode.length > 0) {
            code.add(",").space();
        }
        code.add("..");
    }

    code.space().add("}").space().add("=").space();
    formatExpression(code, init);
    code.add(";");
};

const formatRepeatStatement = (code: CodeBuilder, node: CstNode): void => {
    const condition = childByField(node, "condition");
    const body = childByField(node, "body");

    if (!condition || !body) {
        throw new Error("Invalid repeat statement");
    }

    code.add("repeat").space();
    formatExpression(code, condition);
    code.space();
    formatStatements(code, body);
};

const formatUntilStatement = (code: CodeBuilder, node: CstNode): void => {
    const body = childByField(node, "body");
    const conditionNode = childByField(node, "condition");

    if (!body || !conditionNode) {
        throw new Error("Invalid until statement");
    }

    const condition = conditionNode.children.find(child => child.$ === "node");

    code.add("do").space();
    formatStatements(code, body);
    code.space().add("until (");
    formatExpression(code, condition);
    code.add(")");
    code.add(";");
};

const formatTryStatement = (code: CodeBuilder, node: CstNode): void => {
    const body = childByField(node, "body");
    const handler = childByField(node, "handler");

    if (!body) {
        throw new Error("Invalid try statement");
    }

    code.add("try").space();
    formatStatements(code, body);

    if (handler && handler.$ === "node") {
        const name = childByField(handler, "name");
        const handlerBody = childByField(handler, "body");

        if (!name || !handlerBody) {
            throw new Error("Invalid catch handler");
        }

        code.space().add("catch").space().add("(").add(idText(name)).add(")").space();
        formatStatements(code, handlerBody);
    }
};

const formatForEachStatement = (code: CodeBuilder, node: CstNode): void => {
    const key = childByField(node, "key");
    const value = childByField(node, "value");
    const expression = childByField(node, "expression");
    const body = childByField(node, "body");

    if (!key || !value || !expression || !body) {
        throw new Error("Invalid forEach statement");
    }

    code.add("foreach").space().add("(");
    code.add(idText(key)).add(",").space().add(idText(value)).space().add("in").space();
    formatExpression(code, expression);
    code.add(")").space();
    formatStatements(code, body);
}; 
