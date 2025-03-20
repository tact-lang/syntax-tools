import {Cst} from "./result";

export class CodeBuilder {
    private parts: string[] = [];
    private currentIndent = "";
    private indentStack: string[] = [];
    private atLineStart = true;
    private skipNextSpace = false;

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
        // Split by newlines to handle multiline strings (like comments)
        const lines = part.split("\n");
        if (lines.length === 1) {
            this.addPart(lines[0])
            return this;
        }

        for (let i = 0; i < lines.length; i++) {
            if (i > 0) this.newLine();
            if (lines[i].length > 0) this.addPart(lines[i]);
        }
        return this;
    }

    space(): this {
        if (!this.atLineStart && !this.skipNextSpace) {
            this.parts.push(" ");
        }
        return this;
    }

    apply(callback: (code: CodeBuilder, node: Cst) => void, node: Cst): this {
        callback(this, node);
        return this;
    }

    noSpace(): this {
        this.skipNextSpace = true;
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

    toString(): string {
        return this.parts.join("");
    }
} 
