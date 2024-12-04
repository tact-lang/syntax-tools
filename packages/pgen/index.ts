import minimist from 'minimist';
import generate from "@babel/generator";
import fs from 'fs/promises';
import * as $ from '@langtools/runtime';
import { Grammar } from './grammar';
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

    const ast = $.parse($.left(Grammar, $.eof), code);
    const transformed = transform(ast);
    const sorted = sort(transformed);
    const compiled = compile(sorted);
    const generated = generate(compiled, { minified: false }).code;

    if (target) {
        await fs.writeFile(target, generated, 'utf-8');
    } else {
        console.log(generated);
    }
};

main();