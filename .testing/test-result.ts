import { createContext, Builder, space, skip, File } from "./result";
import { inspect } from "util";
const log = (obj: unknown) => console.log(inspect(obj, { colors: true, depth: Infinity }));

const ctx = createContext(`
// hello world
// some other comment
fun bar(a: Int, other: String /* comment */): string {
    let some = other
}

/* 

some comment

*/

`, space);

const b: Builder = []

skip(ctx, b)
const res = File(ctx, b)

log(res)
log(b)
