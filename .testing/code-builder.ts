import {Cst} from "./result";

export class CodeBuilder {
    private parts: string[] = [];
    private currentIndent = "";
    private indentStack: string[] = [];
    private atLineStart = true;

    constructor(private indentStr: string = "    ") {}

    private addPart(part: string) {
        if (part.length === 0) return this;

        if (this.atLineStart) {
            this.parts.push(this.currentIndent);
            this.atLineStart = false;
        }
        this.parts.push(part);
        return this;
    }

    add(part: string): this {
        this.addPart(part)
        return this;
    }

    space(): this {
        if (!this.atLineStart) {
            this.parts.push(" ");
        }
        return this;
    }

    apply(callback: (code: CodeBuilder, node: Cst) => void, node: Cst): this {
        callback(this, node);
        return this;
    }

    newLine(): this {
        this.parts.push("\n");
        this.atLineStart = true;
        return this;
    }

    indent(): this {
        this.indentStack.push(this.currentIndent);
        this.currentIndent += this.indentStr;
        return this;
    }

    dedent(): this {
        if (this.indentStack.length > 0) {
            this.currentIndent = this.indentStack.pop()!;
        }
        return this;
    }

    trimNewlines(): this {
        let toRemove = 0;
        for (;toRemove < this.parts.length; toRemove++) {
            const index = this.parts.length - 1 - toRemove
            const element = this.parts[index];
            if (element === "\n") {
                continue;
            }
            break
        }
        this.parts = this.parts.slice(0, this.parts.length - toRemove);
        return this
    }

    toString(): string {
        return this.parts.join("");
    }
} 
