import minimist from 'minimist';
import generate from "@babel/generator";
import fs from 'fs/promises';
import * as $ from '@tonstudio/parser-runtime';
import * as G from './grammar';
import { desugar } from './transform';
import { generateTsAst } from './compile';
import { sort } from './sort';

const main = async () => {
    const argv = minimist(process.argv.slice(2));
    const source = argv._[0];
    const target = argv.o;

    if (!source || !target) {
        console.error('Syntax: pgen grammar.gg -o grammar.ts');
        process.exit(1);
    }

    const code = await fs.readFile(source, 'utf-8');

    const ast = $.parse({
        grammar: G.Grammar,
        space: G.space,
        text: code,
    });
    if (ast.$ === 'error') {
        console.error(ast.error);
        process.exit(1);
    }

    const transformed = desugar(ast.value);
    const sorted = sort(transformed);
    const compiled = generateTsAst(sorted);
    const generated = generate(compiled, { minified: false }).code;
    const withEslint = `/* Generated. Do not edit. */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
/* eslint-disable @typescript-eslint/no-unused-vars */
${generated}`;

    if (target) {
        await fs.writeFile(target, withEslint, 'utf-8');
    } else {
        console.log(generated);
    }
};

main();