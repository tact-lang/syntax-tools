# Parser generator

Not only other parser generators for web weren't written here, but they lack a set of features we really need:

- **Type-safety**: API of generated parser should be typed without `any`
- **AST from grammar**: converting untyped trees to AST is unsafe and boring
- <sup>TBD</sup> **CST**: pretty-printer has to keep comments `/**/`, underscores in numbers `1_234` and other features that are nowhere represented in AST.
- **Named lexemes**: good error messages shouldn't report an identifier as "a-z, A-Z, 0-9, or _".
- <sup>TBD</sup> **Error recovery**: programming languages should report more than one error at a time.
- <sup>TBD</sup> **Incremental**: reparse shouldn't take time proprtional to size of the file.
- **High-order rules `A<B>`**: duplicated code leads to increased chance to make a mistake, and high-order rules are required for duplication.
- <sup>TBD</sup> **No stack overflow on large expressions**: nested constructions might lead to stack overflow. 
- **Space skipping**: manually annotating grammar with spaces is error-prone and boring.

## Comparison to peggy

`pgen` mostly follows grammar of [peggy](https://peggyjs.org/documentation.html#grammar-syntax-and-semantics) with a few notable differences.

- Capitalized rules `Foo = ...` create AST nodes with `{ $: 'Foo' }`.
- Rules have to end with semicolon `;`.
- Inline semantic actions `{ return 42; }` are not supported. We can't infer types of AST when there is some inlined JavaScript code, because JS is untyped.
- High-order rules `A<B> = ...` were added.
- Space skipping was added. It uses `space` rule.
- Lexification operator `#` was added.
- Character classes do not support modifiers `[a-z]i`.

## Syntax reference

- Non-AST rule defintion `rule = ...;`
- AST rule defintion `Rule = ...`. Returns an object with `{ $: 'Rule', loc: Loc }` with rest of the fields defined with named clauses in right-hand side.
- Display override for error messaging `Id "identifier" = ...;`
- High-order rule defintion `inter<A, B> = ...;` and call `inter<expression, ",">`
- Left-biased choice `"A" / "B"`. Will match the first matching clause.
- Sequence `foo bar baz`. All clauses should match in sequence.
- Named clauses `"if" "(" expr:expression ")" stmts:statements`. Sequence operator generates an object, and named clauses become its fields `{ expr: ..., stmts: ... }`.
- Picked clause `"if" "(" @expression ")"`. Sequence operator returns only a single value of picked clause.
- Single clause sequence `a = b`. Works as `a = @b`.
- Negative lookahead `!x`. Fails if `x` matches. Doesn't consume input.
- Positive lookahead `&x`. Passes if `x` matches. Doesn't consume input.
- Stringification `$x`. Ignores AST computed by x, returns string that `x` matched.
- Lexification `#x`. Does not skip spaces inside of `x`. If `x` calls some other rules, doesn't skip spaces there either.
- Repeat `x*`.
- Repeat at least once `x+`.
- Optional `x?`.
- String `"abc"`.
- Character class `[a-z_]`. Supports ranges `a-z`. Supports negation `[^a-z]`.

## Implicit syntax

- Spaces are skipped after every terminal: `"string"`, `[a-z]`
- Spaces are skipped after lexification operator `#x`
- Spaces are not skipped inside lexification operator `#x`.
- Spaces are skipped at the start, before rest of the parsing will happen
- If not the whole input was consumed, error will be emitted
