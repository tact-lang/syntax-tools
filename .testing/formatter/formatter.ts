import {Cst} from "../result";
import {CodeBuilder} from "../code-builder";
import {formatFunction, formatNativeFunction, formatAsmFunction, formatPrimitiveType} from "./format-declarations";
import {formatStatement} from "./format-statements";
import {formatExpression} from "./format-expressions";
import {visit, childByField} from "../cst-helpers";
import {formatConstant, formatContract, formatTrait} from "./format-contracts";
import {formatMessage, formatStruct} from "./format-structs";
import {formatImport} from "./format-imports";

export const format = (node: Cst): string => {
    const code = new CodeBuilder();
    formatNode(code, node);
    return code.toString();
};

const formatNode = (code: CodeBuilder, node: Cst): void => {
    if (node.$ === "leaf") {
        code.add(node.text);
        return;
    }

    switch (node.type) {
        case "Root":
            node.children.forEach((child, index) => {
                formatNode(code, child);
                if (index < node.children.length - 2) {
                    code.newLine();
                }
            });
            code.newLine()
            break;

        case "Module":
            const imports = childByField(node, "imports");
            if (imports) {
                if (imports.type === "Import") {
                    // single import
                    formatImport(code, imports);
                    code.newLine();
                } else {
                    imports.children.forEach((item, index) => {
                        if (item.$ !== "node") return;

                        if (item.type === "Import") {
                            formatImport(code, item);
                            code.newLine();
                        }
                    });
                }

                code.newLine();
            }

            const items = childByField(node, "items");
            if (!items) {
                break
            }

            items.children.forEach((item, index) => {
                if (item.$ !== "node") return;

                formatNode(code, item);
                if (index < items.children.length - 1) {
                    code.newLine();
                    code.newLine();
                }
            });
            break;

        case "PrimitiveTypeDecl":
            formatPrimitiveType(code, node);
            break;
        case "$Function":
            formatFunction(code, node);
            break;
        case "NativeFunctionDecl":
            formatNativeFunction(code, node);
            break;
        case "AsmFunction":
            formatAsmFunction(code, node);
            break;
        case "Contract":
            formatContract(code, node);
            break;
        case "Trait":
            formatTrait(code, node);
            break;
        case "StructDecl":
            formatStruct(code, node);
            break;
        case "MessageDecl":
            formatMessage(code, node);
            break;
        case "Constant":
            formatConstant(code, node);
            break;
        case "Comment":
            code.add(visit(node).trim());
            break;
        case "StatementDestruct":
        case "StatementRepeat":
        case "StatementUntil":
        case "StatementTry":
        case "StatementForEach":
        case "StatementLet":
        case "StatementReturn":
        case "StatementExpression":
        case "StatementAssign":
        case "StatementCondition":
        case "StatementWhile":
        case "StatementBlock":
            formatStatement(code, node);
            break;
        default:
            if (node.group === "expression") {
                formatExpression(code, node);
            } else {
                code.add(visit(node).trim());
            }
    }
};
