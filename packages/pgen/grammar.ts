import * as $ from "./runtime";
export namespace $$ {
  export type ident$noSkip = string;
  export type formals$noSkip = {
    readonly head: ident$noSkip;
    readonly tail: readonly ident$noSkip[];
  } | undefined;
  export type Name$noSkip = {
    readonly $: "Name";
    readonly name: ident$noSkip;
  };
  export type Choose$noSkip = {
    readonly $: "Choose";
  };
  export type selector$noSkip = Name$noSkip | Choose$noSkip;
  export type SpecialClass$noSkip = {
    readonly $: "SpecialClass";
    readonly value: "\\" | string;
  };
  export type Named$noSkip = {
    readonly $: "Named";
    readonly value: "b" | "n" | "r" | "t";
  };
  export type hexDigit$noSkip = {};
  export type Short$noSkip = {
    readonly $: "Short";
    readonly value: string;
  };
  export type Long$noSkip = {
    readonly $: "Long";
    readonly value: string;
  };
  export type unicode$noSkip = Short$noSkip | Long$noSkip;
  export type Ascii$noSkip = {
    readonly $: "Ascii";
    readonly value: string;
  };
  export type escape$noSkip = Named$noSkip | unicode$noSkip | Ascii$noSkip;
  export type ClassChar$noSkip = {
    readonly $: "ClassChar";
    readonly value: "\\" | string;
  };
  export type classChar$noSkip = SpecialClass$noSkip | escape$noSkip | ClassChar$noSkip;
  export type Group$noSkip = {
    readonly $: "Group";
    readonly from: classChar$noSkip;
    readonly to: classChar$noSkip;
  };
  export type classSeq$noSkip = Group$noSkip | classChar$noSkip;
  export type Class$noSkip = {
    readonly $: "Class";
    readonly negated: "^" | undefined;
    readonly seqs: readonly classSeq$noSkip[];
    readonly insensitive: "i" | undefined;
  };
  export type Special$noSkip = {
    readonly $: "Special";
    readonly value: "\\" | "\"";
  };
  export type Char$noSkip = {
    readonly $: "Char";
    readonly value: "\\" | "\"";
  };
  export type char$noSkip = Special$noSkip | escape$noSkip | Char$noSkip;
  export type Terminal$noSkip = {
    readonly $: "Terminal";
    readonly value: readonly char$noSkip[];
  };
  export type Any$noSkip = {
    readonly $: "Any";
  };
  export type paren$noSkip = Alt$noSkip;
  export type params$noSkip = {
    readonly head: Seq$noSkip;
    readonly tail: readonly Seq$noSkip[];
  } | undefined;
  export type Apply$noSkip = {
    readonly $: "Apply";
    readonly name: ident$noSkip;
    readonly params: params$noSkip | undefined;
  };
  export type base$noSkip = Apply$noSkip | Class$noSkip | Terminal$noSkip | paren$noSkip | Any$noSkip;
  export type Iter$noSkip = {
    readonly $: "Iter";
    readonly prefix: readonly ("!" | "&" | "#" | "$")[];
    readonly expr: base$noSkip;
    readonly suffix: "*" | "+" | "?" | undefined;
  };
  export type Sel$noSkip = {
    readonly $: "Sel";
    readonly selector: selector$noSkip | undefined;
    readonly expr: Iter$noSkip;
  };
  export type Seq$noSkip = {
    readonly $: "Seq";
    readonly exprs: readonly Sel$noSkip[];
  };
  export type Alt$noSkip = {
    readonly $: "Alt";
    readonly head: Seq$noSkip;
    readonly tail: readonly Seq$noSkip[];
  };
  export type ruleBody$noSkip = Alt$noSkip;
  export type Rule$noSkip = {
    readonly $: "Rule";
    readonly name: ident$noSkip;
    readonly formals: formals$noSkip | undefined;
    readonly body: ruleBody$noSkip;
  };
  export type Grammar$noSkip = {
    readonly $: "Grammar";
    readonly rules: readonly Rule$noSkip[];
  };
  export type Single$noSkip = {
    readonly $: "Single";
    readonly value: string;
  };
  export type Multi$noSkip = {
    readonly $: "Multi";
    readonly value: string;
  };
  export type space$noSkip = {} | {} | {};
  export type ident = string;
  export type formals = {
    readonly head: ident;
    readonly tail: readonly ident[];
  } | undefined;
  export type Name = {
    readonly $: "Name";
    readonly name: ident;
  };
  export type Choose = {
    readonly $: "Choose";
  };
  export type selector = Name | Choose;
  export type Any = {
    readonly $: "Any";
  };
  export type paren = Alt;
  export type params = {
    readonly head: Seq;
    readonly tail: readonly Seq[];
  } | undefined;
  export type Apply = {
    readonly $: "Apply";
    readonly name: ident;
    readonly params: params | undefined;
  };
  export type base = Apply | Class$noSkip | Terminal$noSkip | paren | Any;
  export type Iter = {
    readonly $: "Iter";
    readonly prefix: readonly ("!" | "&" | "#" | "$")[];
    readonly expr: base;
    readonly suffix: "*" | "+" | "?" | undefined;
  };
  export type Sel = {
    readonly $: "Sel";
    readonly selector: selector | undefined;
    readonly expr: Iter;
  };
  export type Seq = {
    readonly $: "Seq";
    readonly exprs: readonly Sel[];
  };
  export type Alt = {
    readonly $: "Alt";
    readonly head: Seq;
    readonly tail: readonly Seq[];
  };
  export type ruleBody = Alt;
  export type Rule = {
    readonly $: "Rule";
    readonly name: ident;
    readonly formals: formals | undefined;
    readonly body: ruleBody;
  };
  export type Grammar = {
    readonly $: "Grammar";
    readonly rules: readonly Rule[];
  };
  export type SpecialClass = {
    readonly $: "SpecialClass";
    readonly value: "\\" | string;
  };
  export type Named = {
    readonly $: "Named";
    readonly value: "b" | "n" | "r" | "t";
  };
  export type hexDigit = {};
  export type Short = {
    readonly $: "Short";
    readonly value: string;
  };
  export type Long = {
    readonly $: "Long";
    readonly value: string;
  };
  export type unicode = Short | Long;
  export type Ascii = {
    readonly $: "Ascii";
    readonly value: string;
  };
  export type escape = Named | unicode | Ascii;
  export type ClassChar = {
    readonly $: "ClassChar";
    readonly value: "\\" | string;
  };
  export type classChar = SpecialClass | escape | ClassChar;
  export type Group = {
    readonly $: "Group";
    readonly from: classChar;
    readonly to: classChar;
  };
  export type classSeq = Group | classChar;
  export type Class = {
    readonly $: "Class";
    readonly negated: "^" | undefined;
    readonly seqs: readonly classSeq[];
    readonly insensitive: "i" | undefined;
  };
  export type Special = {
    readonly $: "Special";
    readonly value: "\\" | "\"";
  };
  export type Char = {
    readonly $: "Char";
    readonly value: "\\" | "\"";
  };
  export type char = Special | escape | Char;
  export type Terminal = {
    readonly $: "Terminal";
    readonly value: readonly char[];
  };
  export type Single = {
    readonly $: "Single";
    readonly value: string;
  };
  export type Multi = {
    readonly $: "Multi";
    readonly value: string;
  };
  export type space = {} | {} | {};
  export type eof$noSkip = {};
  export type eof = {};
}
export const ident$noSkip: $.Parser<$$.ident$noSkip> = $.stry($.right($.regex<string | "_">("a-z_", true), $.right($.star($.regex<string | string | "_">("a-z0-9_", true)), $.eps)));
export const formals$noSkip: $.Parser<$$.formals$noSkip> = $.right($.str("<"), $.left($.opt($.field(ident$noSkip, "head", $.field($.star($.right($.str(","), ident$noSkip)), "tail", $.eps))), $.str(">")));
export const Name$noSkip: $.Parser<$$.Name$noSkip> = $.field($.pure("Name"), "$", $.field(ident$noSkip, "name", $.right($.str(":"), $.eps)));
export const Choose$noSkip: $.Parser<$$.Choose$noSkip> = $.field($.pure("Choose"), "$", $.right($.str("@"), $.eps));
export const selector$noSkip: $.Parser<$$.selector$noSkip> = $.alt(Name$noSkip, Choose$noSkip);
export const SpecialClass$noSkip: $.Parser<$$.SpecialClass$noSkip> = $.field($.pure("SpecialClass"), "$", $.field($.regex<"\\" | string>("\\\\\\]", false), "value", $.eps));
export const Named$noSkip: $.Parser<$$.Named$noSkip> = $.field($.pure("Named"), "$", $.field($.regex<"b" | "n" | "r" | "t">("bnrt", false), "value", $.eps));
export const hexDigit$noSkip: $.Parser<$$.hexDigit$noSkip> = $.right($.regex<string | string>("0-9a-f", true), $.eps);
export const Short$noSkip: $.Parser<$$.Short$noSkip> = $.field($.pure("Short"), "$", $.field($.stry($.right(hexDigit$noSkip, $.right(hexDigit$noSkip, $.right(hexDigit$noSkip, $.right(hexDigit$noSkip, $.eps))))), "value", $.eps));
export const Long$noSkip: $.Parser<$$.Long$noSkip> = $.field($.pure("Long"), "$", $.right($.str("{"), $.field($.stry($.plus(hexDigit$noSkip)), "value", $.right($.str("}"), $.eps))));
export const unicode$noSkip: $.Parser<$$.unicode$noSkip> = $.right($.str("u"), $.alt(Short$noSkip, Long$noSkip));
export const Ascii$noSkip: $.Parser<$$.Ascii$noSkip> = $.field($.pure("Ascii"), "$", $.right($.str("x"), $.field($.stry($.right(hexDigit$noSkip, $.right(hexDigit$noSkip, $.eps))), "value", $.eps)));
export const escape$noSkip: $.Parser<$$.escape$noSkip> = $.alt(Named$noSkip, $.alt(unicode$noSkip, Ascii$noSkip));
export const ClassChar$noSkip: $.Parser<$$.ClassChar$noSkip> = $.field($.pure("ClassChar"), "$", $.field($.regex<"\\" | string>("^\\\\\\]", false), "value", $.eps));
export const classChar$noSkip: $.Parser<$$.classChar$noSkip> = $.alt($.right($.str("\\"), $.alt(SpecialClass$noSkip, escape$noSkip)), ClassChar$noSkip);
export const Group$noSkip: $.Parser<$$.Group$noSkip> = $.field($.pure("Group"), "$", $.field(classChar$noSkip, "from", $.right($.str("-"), $.field(classChar$noSkip, "to", $.eps))));
export const classSeq$noSkip: $.Parser<$$.classSeq$noSkip> = $.alt(Group$noSkip, classChar$noSkip);
export const Class$noSkip: $.Parser<$$.Class$noSkip> = $.field($.pure("Class"), "$", $.right($.str("["), $.field($.opt($.str("^")), "negated", $.field($.star(classSeq$noSkip), "seqs", $.right($.str("]"), $.field($.opt($.str("i")), "insensitive", $.eps))))));
export const Special$noSkip: $.Parser<$$.Special$noSkip> = $.field($.pure("Special"), "$", $.field($.regex<"\\" | "\"">("\\\\\"", false), "value", $.eps));
export const Char$noSkip: $.Parser<$$.Char$noSkip> = $.field($.pure("Char"), "$", $.field($.regex<"\\" | "\"">("^\\\\\"", false), "value", $.eps));
export const char$noSkip: $.Parser<$$.char$noSkip> = $.alt($.right($.str("\\"), $.alt(Special$noSkip, escape$noSkip)), Char$noSkip);
export const Terminal$noSkip: $.Parser<$$.Terminal$noSkip> = $.field($.pure("Terminal"), "$", $.right($.str("\""), $.field($.star(char$noSkip), "value", $.right($.str("\""), $.eps))));
export const Any$noSkip: $.Parser<$$.Any$noSkip> = $.field($.pure("Any"), "$", $.right($.str("."), $.eps));
export const paren$noSkip: $.Parser<$$.paren$noSkip> = $.right($.str("("), $.left($.ref(() => Alt$noSkip), $.str(")")));
export const params$noSkip: $.Parser<$$.params$noSkip> = $.right($.str("<"), $.left($.opt($.field($.ref(() => Seq$noSkip), "head", $.field($.star($.right($.str(","), $.ref(() => Seq$noSkip))), "tail", $.eps))), $.str(">")));
export const Apply$noSkip: $.Parser<$$.Apply$noSkip> = $.field($.pure("Apply"), "$", $.field(ident$noSkip, "name", $.field($.opt(params$noSkip), "params", $.eps)));
export const base$noSkip: $.Parser<$$.base$noSkip> = $.alt(Apply$noSkip, $.alt(Class$noSkip, $.alt(Terminal$noSkip, $.alt(paren$noSkip, Any$noSkip))));
export const Iter$noSkip: $.Parser<$$.Iter$noSkip> = $.field($.pure("Iter"), "$", $.field($.star($.regex<"!" | "&" | "#" | "$">("!&#$", false)), "prefix", $.field(base$noSkip, "expr", $.field($.opt($.regex<"*" | "+" | "?">("*+?", false)), "suffix", $.eps))));
export const Sel$noSkip: $.Parser<$$.Sel$noSkip> = $.field($.pure("Sel"), "$", $.field($.opt(selector$noSkip), "selector", $.field(Iter$noSkip, "expr", $.eps)));
export const Seq$noSkip: $.Parser<$$.Seq$noSkip> = $.field($.pure("Seq"), "$", $.field($.star(Sel$noSkip), "exprs", $.eps));
export const Alt$noSkip: $.Parser<$$.Alt$noSkip> = $.field($.pure("Alt"), "$", $.field(Seq$noSkip, "head", $.field($.star($.right($.str("/"), Seq$noSkip)), "tail", $.eps)));
export const ruleBody$noSkip: $.Parser<$$.ruleBody$noSkip> = Alt$noSkip;
export const Rule$noSkip: $.Parser<$$.Rule$noSkip> = $.field($.pure("Rule"), "$", $.field(ident$noSkip, "name", $.field($.opt(formals$noSkip), "formals", $.right($.str("="), $.field(ruleBody$noSkip, "body", $.right($.str(";"), $.eps))))));
export const Grammar$noSkip: $.Parser<$$.Grammar$noSkip> = $.field($.pure("Grammar"), "$", $.field($.star(Rule$noSkip), "rules", $.eps));
export const Single$noSkip: $.Parser<$$.Single$noSkip> = $.field($.pure("Single"), "$", $.right($.str("//"), $.field($.stry($.star($.regex<"\n" | "\r">("^\\n\\r", false))), "value", $.eps)));
export const Multi$noSkip: $.Parser<$$.Multi$noSkip> = $.field($.pure("Multi"), "$", $.right($.str("/*"), $.field($.stry($.star($.right($.lookNeg($.str("*/")), $.right($.any, $.eps)))), "value", $.right($.str("*/"), $.eps))));
export const space$noSkip: $.Parser<$$.space$noSkip> = $.alt($.right($.regex<" " | "\t" | "\n" | "\r">(" \\t\\n\\r", false), $.eps), $.alt($.right(Single$noSkip, $.eps), $.right(Multi$noSkip, $.eps)));
export const ident: $.Parser<$$.ident> = $.left($.stry($.right($.regex<string | "_">("a-z_", true), $.right($.star($.regex<string | string | "_">("a-z0-9_", true)), $.eps))), $.star(space$noSkip));
export const formals: $.Parser<$$.formals> = $.right($.left($.str("<"), $.star(space$noSkip)), $.left($.opt($.field(ident, "head", $.field($.star($.right($.left($.str(","), $.star(space$noSkip)), ident)), "tail", $.eps))), $.left($.str(">"), $.star(space$noSkip))));
export const Name: $.Parser<$$.Name> = $.field($.pure("Name"), "$", $.field(ident, "name", $.right($.left($.str(":"), $.star(space$noSkip)), $.eps)));
export const Choose: $.Parser<$$.Choose> = $.field($.pure("Choose"), "$", $.right($.left($.str("@"), $.star(space$noSkip)), $.eps));
export const selector: $.Parser<$$.selector> = $.alt(Name, Choose);
export const Any: $.Parser<$$.Any> = $.field($.pure("Any"), "$", $.right($.left($.str("."), $.star(space$noSkip)), $.eps));
export const paren: $.Parser<$$.paren> = $.right($.left($.str("("), $.star(space$noSkip)), $.left($.ref(() => Alt), $.left($.str(")"), $.star(space$noSkip))));
export const params: $.Parser<$$.params> = $.right($.left($.str("<"), $.star(space$noSkip)), $.left($.opt($.field($.ref(() => Seq), "head", $.field($.star($.right($.left($.str(","), $.star(space$noSkip)), $.ref(() => Seq))), "tail", $.eps))), $.left($.str(">"), $.star(space$noSkip))));
export const Apply: $.Parser<$$.Apply> = $.field($.pure("Apply"), "$", $.field(ident, "name", $.field($.opt(params), "params", $.eps)));
export const base: $.Parser<$$.base> = $.alt(Apply, $.alt($.left(Class$noSkip, $.star(space$noSkip)), $.alt($.left(Terminal$noSkip, $.star(space$noSkip)), $.alt(paren, Any))));
export const Iter: $.Parser<$$.Iter> = $.field($.pure("Iter"), "$", $.field($.star($.left($.regex<"!" | "&" | "#" | "$">("!&#$", false), $.star(space$noSkip))), "prefix", $.field(base, "expr", $.field($.opt($.left($.regex<"*" | "+" | "?">("*+?", false), $.star(space$noSkip))), "suffix", $.eps))));
export const Sel: $.Parser<$$.Sel> = $.field($.pure("Sel"), "$", $.field($.opt(selector), "selector", $.field(Iter, "expr", $.eps)));
export const Seq: $.Parser<$$.Seq> = $.field($.pure("Seq"), "$", $.field($.star(Sel), "exprs", $.eps));
export const Alt: $.Parser<$$.Alt> = $.field($.pure("Alt"), "$", $.field(Seq, "head", $.field($.star($.right($.left($.str("/"), $.star(space$noSkip)), Seq)), "tail", $.eps)));
export const ruleBody: $.Parser<$$.ruleBody> = Alt;
export const Rule: $.Parser<$$.Rule> = $.field($.pure("Rule"), "$", $.field(ident, "name", $.field($.opt(formals), "formals", $.right($.left($.str("="), $.star(space$noSkip)), $.field(ruleBody, "body", $.right($.left($.str(";"), $.star(space$noSkip)), $.eps))))));
export const Grammar: $.Parser<$$.Grammar> = $.field($.pure("Grammar"), "$", $.field($.star(Rule), "rules", $.eps));
export const SpecialClass: $.Parser<$$.SpecialClass> = $.field($.pure("SpecialClass"), "$", $.field($.left($.regex<"\\" | string>("\\\\\\]", false), $.star(space$noSkip)), "value", $.eps));
export const Named: $.Parser<$$.Named> = $.field($.pure("Named"), "$", $.field($.left($.regex<"b" | "n" | "r" | "t">("bnrt", false), $.star(space$noSkip)), "value", $.eps));
export const hexDigit: $.Parser<$$.hexDigit> = $.right($.left($.regex<string | string>("0-9a-f", true), $.star(space$noSkip)), $.eps);
export const Short: $.Parser<$$.Short> = $.field($.pure("Short"), "$", $.field($.stry($.right(hexDigit, $.right(hexDigit, $.right(hexDigit, $.right(hexDigit, $.eps))))), "value", $.eps));
export const Long: $.Parser<$$.Long> = $.field($.pure("Long"), "$", $.right($.left($.str("{"), $.star(space$noSkip)), $.field($.stry($.plus(hexDigit)), "value", $.right($.left($.str("}"), $.star(space$noSkip)), $.eps))));
export const unicode: $.Parser<$$.unicode> = $.right($.left($.str("u"), $.star(space$noSkip)), $.alt(Short, Long));
export const Ascii: $.Parser<$$.Ascii> = $.field($.pure("Ascii"), "$", $.right($.left($.str("x"), $.star(space$noSkip)), $.field($.stry($.right(hexDigit, $.right(hexDigit, $.eps))), "value", $.eps)));
export const escape: $.Parser<$$.escape> = $.alt(Named, $.alt(unicode, Ascii));
export const ClassChar: $.Parser<$$.ClassChar> = $.field($.pure("ClassChar"), "$", $.field($.left($.regex<"\\" | string>("^\\\\\\]", false), $.star(space$noSkip)), "value", $.eps));
export const classChar: $.Parser<$$.classChar> = $.alt($.right($.left($.str("\\"), $.star(space$noSkip)), $.alt(SpecialClass, escape)), ClassChar);
export const Group: $.Parser<$$.Group> = $.field($.pure("Group"), "$", $.field(classChar, "from", $.right($.left($.str("-"), $.star(space$noSkip)), $.field(classChar, "to", $.eps))));
export const classSeq: $.Parser<$$.classSeq> = $.alt(Group, classChar);
export const Class: $.Parser<$$.Class> = $.field($.pure("Class"), "$", $.right($.left($.str("["), $.star(space$noSkip)), $.field($.opt($.left($.str("^"), $.star(space$noSkip))), "negated", $.field($.star(classSeq), "seqs", $.right($.left($.str("]"), $.star(space$noSkip)), $.field($.opt($.left($.str("i"), $.star(space$noSkip))), "insensitive", $.eps))))));
export const Special: $.Parser<$$.Special> = $.field($.pure("Special"), "$", $.field($.left($.regex<"\\" | "\"">("\\\\\"", false), $.star(space$noSkip)), "value", $.eps));
export const Char: $.Parser<$$.Char> = $.field($.pure("Char"), "$", $.field($.left($.regex<"\\" | "\"">("^\\\\\"", false), $.star(space$noSkip)), "value", $.eps));
export const char: $.Parser<$$.char> = $.alt($.right($.left($.str("\\"), $.star(space$noSkip)), $.alt(Special, escape)), Char);
export const Terminal: $.Parser<$$.Terminal> = $.field($.pure("Terminal"), "$", $.right($.left($.str("\""), $.star(space$noSkip)), $.field($.star(char), "value", $.right($.left($.str("\""), $.star(space$noSkip)), $.eps))));
export const Single: $.Parser<$$.Single> = $.field($.pure("Single"), "$", $.right($.left($.str("//"), $.star(space$noSkip)), $.field($.stry($.star($.left($.regex<"\n" | "\r">("^\\n\\r", false), $.star(space$noSkip)))), "value", $.eps)));
export const Multi: $.Parser<$$.Multi> = $.field($.pure("Multi"), "$", $.right($.left($.str("/*"), $.star(space$noSkip)), $.field($.stry($.star($.right($.lookNeg($.left($.str("*/"), $.star(space$noSkip))), $.right($.left($.any, $.star(space$noSkip)), $.eps)))), "value", $.right($.left($.str("*/"), $.star(space$noSkip)), $.eps))));
export const space: $.Parser<$$.space> = $.alt($.right($.left($.regex<" " | "\t" | "\n" | "\r">(" \\t\\n\\r", false), $.star(space$noSkip)), $.eps), $.alt($.right(Single, $.eps), $.right(Multi, $.eps)));
export const eof$noSkip: $.Parser<$$.eof$noSkip> = $.right($.lookNeg($.any), $.eps);
export const eof: $.Parser<$$.eof> = $.right($.lookNeg($.left($.any, $.star(space$noSkip))), $.eps);