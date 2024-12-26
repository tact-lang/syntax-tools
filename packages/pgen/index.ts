import minimist from 'minimist';
import generate from "@babel/generator";
import fs from 'fs/promises';
import * as $ from '@langtools/runtime';
import * as G from './grammar';
import { transform } from './transform';
import { compile } from './compile';
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

    const ast = $.parse($.compile(G.Grammar, G.space))(code);
    if (ast.$ === 'error') {
        console.error(ast.error);
        process.exit(1);
    }

    const transformed = transform(ast.value);
    const sorted = sort(transformed);
    const compiled = compile(sorted);
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