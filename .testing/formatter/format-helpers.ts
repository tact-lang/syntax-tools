import {CodeBuilder} from "../code-builder";

export const formatCommaSeparatedList = (
    code: CodeBuilder,
    items: string[],
    options: {
        forceMultiline?: boolean,
        wrapperLeft?: string,
        wrapperRight?: string,
    } = {}
): void => {
    const {
        forceMultiline = false,
        wrapperLeft = "(",
        wrapperRight = ")",
    } = options;

    const shouldBeMultiline = forceMultiline || items.some(item => item.includes("\n"));

    code.add(wrapperLeft);
    
    if (shouldBeMultiline) {
        code.newLine().indent();
        items.forEach((item, i) => {
            code.add(item);
            if (i < items.length - 1) {
                code.add(",").newLine();
            } else {
                code.add(",").newLine();
            }
        });
        code.dedent().add(wrapperRight);
    } else {
        items.forEach((item, i) => {
            code.add(item);
            if (i < items.length - 1) {
                code.add(",").space();
            }
        });
        code.add(wrapperRight);
    }
}; 
