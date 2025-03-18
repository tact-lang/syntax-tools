import {Cst, CstNode} from "../result";
import {CodeBuilder} from "../code-builder";
import {visit} from "../cst-helpers";

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

export const formatCommaSeparatedList = (
    code: CodeBuilder,
    node: CstNode,
    formatItem: (code: CodeBuilder, item: Cst) => void,
    options: {
        startIndex?: number;
        endIndex?: number;
        wrapperLeft?: string,
        wrapperRight?: string,
        extraWrapperSpace?: string,
    } = {}
): void => {
    const {
        wrapperLeft = "(",
        wrapperRight = ")",
    } = options;

    const info = collectListInfo(node, options.startIndex ?? 1, options.endIndex ?? -1);
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

        items.forEach((item, index) => {
            item.leadingComments.forEach(comment => {
                code.add(visit(comment.node));
                if (comment.hasNewline) {
                    code.newLine();
                } else {
                    code.space();
                }
            });

            formatItem(code, item.item);
            code.add(",");

            item.trailingComments.forEach(comment => {
                code.space().add(visit(comment.node));
                if (comment.hasNewline) {
                    code.newLine();
                }
            });

            code.newLine();
        });

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
        if (options.extraWrapperSpace) {
            code.add(options.extraWrapperSpace);
        }

        info.leadingComments.forEach((comment, index) => {
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
                code.add(",").space();
            }
        });

        if (options.extraWrapperSpace) {
            code.add(options.extraWrapperSpace);
        }

        code.add(wrapperRight);
    }
}; 
