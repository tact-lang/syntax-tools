import { createContext, Context, Rule, Builder, Func, CstNode, space, skip, File } from "./result";
import { inspect } from "util";
const log = (obj: unknown) => console.log(inspect(obj, { colors: true, depth: Infinity }));

const ctx = createContext(`
// helloworld
fun bar(a: int): string {}

fun foo() {}
`, space);

const b: Builder = []

skip(ctx, b)
const res = File(ctx, b)

log(res)
log(b)
