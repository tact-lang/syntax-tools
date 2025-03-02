import {createContext, Builder, space, skip, Module} from "./result";
import { inspect } from "util";
const log = (obj: unknown) => console.log(inspect(obj, { colors: true, depth: Infinity }));

const ctx = createContext(`
// hello world
// some other comment
fun bar(a: Int, other: String /* comment */): String {
    let some: Int = other;
}

/* 

some comment

*/

`, space);

const b: Builder = []

skip(ctx, b)
const res = Module(ctx, b)

log(res)
log(b)
