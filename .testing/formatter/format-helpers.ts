import {Cst, CstNode} from "../result";
import {CodeBuilder} from "../code-builder";
import {childByField, visit} from "../cst-helpers";

interface CommentWithNewline {
    node: CstNode;
    hasNewline: boolean;
}

interface ListInfo {
    items: ListItemInfo[];
    leadingComments: CommentWithNewline[];
    trailingComments: CommentWithNewline[];
    shouldBeMultiline: boolean;
}

interface ListItemInfo {
    item: Cst;
    leadingComments: CommentWithNewline[];
    trailingComments: CommentWithNewline[];
    hasLeadingNewline: boolean;
    hasTrailingNewline: boolean;
}

export function collectListInfo(node: CstNode, startIndex: number, endIndex: number): ListInfo {
    const result: ListItemInfo[] = [];
    let currentItem: ListItemInfo | null = null;
    let wasComma: boolean = false;
    let listLeadingComments: CommentWithNewline[] = [];
    let leadingComments: CommentWithNewline[] = [];
    let inLeadingComments: boolean = true

    let shouldBeMultiline = false;

    let i = startIndex;
    let processList: readonly Cst[] = node.children.slice(0, endIndex === 0 ? node.children.length : endIndex);

    while (i < processList.length) {
        const child = processList[i];

        if (child.$ === "leaf") {
            if (child.text === ",") {
                wasComma = true
            } else if (/\n/.test(child.text)) {
                if (currentItem) {
                    currentItem.hasTrailingNewline = true;
                }

                if (leadingComments.length > 0) {
                    leadingComments[leadingComments.length - 1].hasNewline = true;
                } else if (listLeadingComments.length > 0 && inLeadingComments) {
                    listLeadingComments[listLeadingComments.length - 1].hasNewline = true;
                }

                if (currentItem && wasComma) {
                    result.push(currentItem);
                    currentItem = null;
                    wasComma = false
                }
                shouldBeMultiline = true;
            }
        } else if (child.type === "Comment") {
            const commentWithNewline: CommentWithNewline = {
                node: child,
                hasNewline: false
            };
            if (currentItem) {
                currentItem.trailingComments.push(commentWithNewline);
            } else if (result.length === 0) {
                listLeadingComments.push(commentWithNewline);
            } else {
                leadingComments.push(commentWithNewline);
            }
        } else {
            if (child.type === "tail" || child.type === "fields") {
                processList = child.children;
                i = 0
                continue
            }

            if (currentItem) {
                result.push(currentItem);
                currentItem = null;
                leadingComments = [];
            }

            currentItem = {
                item: child,
                leadingComments: leadingComments,
                trailingComments: [],
                hasLeadingNewline: leadingComments.some(c => c.hasNewline) ||
                    (result.length > 0 && result[result.length - 1].hasTrailingNewline),
                hasTrailingNewline: false,
            };
            leadingComments = [];
            inLeadingComments = false
        }
        i++;
    }

    if (currentItem) {
        result.push(currentItem);
    }

    return {
        items: result,
        shouldBeMultiline,
        leadingComments: listLeadingComments,
        trailingComments: leadingComments
    };
}

export const formatSeparatedList = (
    code: CodeBuilder,
    node: CstNode,
    formatItem: (code: CodeBuilder, item: Cst) => void,
    options: {
        startIndex?: number;
        endIndex?: number;
        wrapperLeft?: string,
        wrapperRight?: string,
        extraWrapperSpace?: string,
        suffixElement?: string,
        needSeparatorAfterSuffixElement?: boolean,
        separator?: string,
        provideTrailingComments?: (item: Cst) => undefined | Cst[],
    } = {}
): void => {
    const {
        wrapperLeft = "(",
        wrapperRight = ")",
        separator = ",",
        startIndex = 1,
        endIndex = -1,
    } = options;

    const info = collectListInfo(node, startIndex, endIndex);
    const items = info.items
    const shouldBeMultiline = info.shouldBeMultiline

    code.add(wrapperLeft);

    if (shouldBeMultiline) {
        code.newLine().indent();

        info.leadingComments.forEach(comment => {
            code.add(visit(comment.node));
            if (comment.hasNewline) {
                code.newLine();
            }
        });

        items.forEach((item) => {
            item.leadingComments.forEach(comment => {
                code.add(visit(comment.node));
                if (comment.hasNewline) {
                    code.newLine();
                } else {
                    code.space();
                }
            });

            formatItem(code, item.item);
            code.add(separator);

            const trailingComments = options.provideTrailingComments?.(item.item) ?? []
            trailingComments.forEach((comment, index) => {
                code.space().add(visit(comment));

                if (index !== trailingComments.length - 1) {
                    code.newLine();
                }
            });

            code.newLine();
        });

        if (options.suffixElement) {
            code.add(options.suffixElement)
            if (options.needSeparatorAfterSuffixElement) {
                code.add(separator)
            }
            code.newLine();
        }

        if (info.trailingComments.length > 0) {
            info.trailingComments.forEach((comment, index) => {
                code.add(visit(comment.node));
                if (comment.hasNewline || index === info.trailingComments.length - 1) {
                    code.newLine();
                }
            });
        }

        code.dedent().add(wrapperRight);
    } else {
        if (items.length !== 0 && options.extraWrapperSpace) {
            code.add(options.extraWrapperSpace);
        }

        info.leadingComments.forEach((comment) => {
            code.add(visit(comment.node));

            if (comment.hasNewline) {
                code.newLine();
            } else {
                code.space();
            }
        });

        items.forEach((item, index) => {
            formatItem(code, item.item);
            if (index < items.length - 1) {
                code.add(separator).space();
            }
        });

        if (options.suffixElement) {
            code.add(separator).space().add(options.suffixElement);
        }

        if (items.length !== 0 && options.extraWrapperSpace) {
            code.add(options.extraWrapperSpace);
        }

        code.add(wrapperRight);
    }
};

export const getCommentsBetween = (node: CstNode, startNode: undefined | Cst, endNode: undefined | Cst): CstNode[] => {
    const startIndex = startNode ? node.children.indexOf(startNode) : -1;
    const endIndex = endNode ? node.children.indexOf(endNode) : node.children.length;

    return node.children.filter((child, childIndex) => {
        if (child.$ !== "node" || child.type !== "Comment") return false;
        return childIndex > startIndex && childIndex < endIndex;
    }) as CstNode[];
};

export function processInlineComments(node: CstNode, code: CodeBuilder, start: Cst, end: Cst) {
    const comments = getCommentsBetween(node, start, end)
    comments.forEach(comment => {
        code.add(visit(comment))
    })
}

// name: Id
//   name: name
//      "some"
export const idText = (node: Cst): string => {
    const name = childByField(node, "name");
    if (!name) return;
    const child = name.children[0]
    if (!child) return;
    return visit(child);
}

export const formatId = (code: CodeBuilder, node: CstNode) => {
    const name = idText(node);
    code.add(name)

    const comments = node.children.filter(it => it.$ === "node" && it.type === "Comment");

    if (comments.length > 0) {
        code.space();
        comments.forEach(comment => {
            code.add(visit(comment))
        })
    }
}

export function containsSeveralNewlines(text: string): boolean {
    const index = text.indexOf("\n")
    if (index === -1) {
        return false
    }
    return text.substring(index + 1).includes("\n")
}

export function trailingNewlines(node: Cst): string {
    if (node.$ === "leaf") return ""
    let lastChild = node.children.at(-1)
    if (node.$ === "node" && (node.type === "Receiver" || node.type === "ContractInit" || node.type === "Constant")) {
        const body = childByField(node, "body")
        if (body) {
            lastChild = body.children.at(-1)
        }
    }
    if (node.$ === "node" && node.type === "$Function") {
        const body = childByField(node, "body")
        if (body) {
            const innerBody = childByField(body, "body")
            if (innerBody) {
                lastChild = innerBody.children.at(-1)
            } else {
                lastChild = body.children.at(-1)
            }
        }
    }
    if (lastChild.$ === "leaf" && lastChild.text.includes("\n")) {
        return lastChild.text
    }
    return ""
}
