/* Generated. Do not edit. */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-redundant-type-constituents */
/* eslint-disable @typescript-eslint/no-duplicate-type-constituents */
/* eslint-disable @typescript-eslint/no-unused-vars */
import * as $ from "@tonstudio/parser-runtime";
export namespace $ast {
  export type Grammar = $.Located<{
    readonly $: "Grammar";
    readonly rules: readonly Rule[];
  }>;
  export type Rule = $.Located<{
    readonly $: "Rule";
    readonly name: ident;
    readonly display: $string | undefined;
    readonly formals: formals | undefined;
    readonly body: ruleBody;
  }>;
  export type ident = string;
  export type formals = {
    readonly head: ident;
    readonly tail: readonly ident[];
  } | undefined;
  export type Alt = $.Located<{
    readonly $: "Alt";
    readonly head: Seq;
    readonly tail: readonly Seq[];
  }>;
  export type ruleBody = Alt;
  export type Seq = $.Located<{
    readonly $: "Seq";
    readonly exprs: readonly Sel[];
  }>;
  export type Sel = $.Located<{
    readonly $: "Sel";
    readonly selector: selector | undefined;
    readonly expr: Iter;
  }>;
  export type Name = $.Located<{
    readonly $: "Name";
    readonly name: ident;
  }>;
  export type Choose = $.Located<{
    readonly $: "Choose";
  }>;
  export type selector = Name | Choose;
  export type Iter = $.Located<{
    readonly $: "Iter";
    readonly prefix: readonly ("!" | "&" | "#" | "$")[];
    readonly expr: base;
    readonly suffix: "*" | "+" | "?" | undefined;
  }>;
  export type Apply = $.Located<{
    readonly $: "Apply";
    readonly name: ident;
    readonly params: params | undefined;
  }>;
  export type Terminal = $.Located<{
    readonly $: "Terminal";
    readonly value: $string;
  }>;
  export type paren = Alt;
  export type Any = $.Located<{
    readonly $: "Any";
  }>;
  export type base = Apply | Class | Terminal | paren | Any;
  export type params = {
    readonly head: Alt;
    readonly tail: readonly Alt[];
  } | undefined;
  export type Class = $.Located<{
    readonly $: "Class";
    readonly negated: "^" | undefined;
    readonly seqs: readonly classSeq[];
  }>;
  export type Group = $.Located<{
    readonly $: "Group";
    readonly from: classChar;
    readonly to: classChar;
  }>;
  export type SpecialClass = $.Located<{
    readonly $: "SpecialClass";
    readonly value: "\\" | string;
  }>;
  export type Named = $.Located<{
    readonly $: "Named";
    readonly value: "b" | "n" | "r" | "t";
  }>;
  export type Short = $.Located<{
    readonly $: "Short";
    readonly value: string;
  }>;
  export type Long = $.Located<{
    readonly $: "Long";
    readonly value: string;
  }>;
  export type unicode = Short | Long;
  export type Ascii = $.Located<{
    readonly $: "Ascii";
    readonly value: string;
  }>;
  export type escape = Named | unicode | Ascii;
  export type ClassChar = $.Located<{
    readonly $: "ClassChar";
    readonly value: "\\" | string;
  }>;
  export type classChar = SpecialClass | escape | ClassChar;
  export type classSeq = Group | classChar;
  export type $string = readonly $char[];
  export type Special = $.Located<{
    readonly $: "Special";
    readonly value: "\\" | "\"";
  }>;
  export type Char = $.Located<{
    readonly $: "Char";
    readonly value: "\\" | "\"";
  }>;
  export type $char = Special | escape | Char;
  export type hexDigit = string | string | string;
  export type Single = $.Located<{
    readonly $: "Single";
    readonly value: string;
  }>;
  export type Multi = $.Located<{
    readonly $: "Multi";
    readonly value: string;
  }>;
  export type space = " " | "\t" | "\n" | "\r" | Single | Multi;
  export type eof = undefined;
}
export const Grammar: $.Parser<$ast.Grammar> = $.loc($.field($.pure("Grammar"), "$", $.field($.star($.lazy(() => Rule)), "rules", $.eps)));
export const Rule: $.Parser<$ast.Rule> = $.loc($.field($.pure("Rule"), "$", $.field($.lazy(() => ident), "name", $.field($.opt($.lazy(() => $string)), "display", $.field($.opt($.lazy(() => formals)), "formals", $.right($.str("="), $.field($.lazy(() => ruleBody), "body", $.right($.str(";"), $.eps))))))));
export const ident: $.Parser<$ast.ident> = $.lex($.stry($.right($.regex<string | string | "_">("a-zA-Z_", [$.ExpRange("a", "z"), $.ExpRange("A", "Z"), $.ExpString("_")]), $.right($.star($.regex<string | string | string | "_">("a-zA-Z0-9_", [$.ExpRange("a", "z"), $.ExpRange("A", "Z"), $.ExpRange("0", "9"), $.ExpString("_")])), $.eps))));
export const formals: $.Parser<$ast.formals> = $.right($.str("<"), $.left($.opt($.field(ident, "head", $.field($.star($.right($.str(","), ident)), "tail", $.eps))), $.str(">")));
export const Alt: $.Parser<$ast.Alt> = $.loc($.field($.pure("Alt"), "$", $.field($.lazy(() => Seq), "head", $.field($.star($.right($.str("/"), $.lazy(() => Seq))), "tail", $.eps))));
export const ruleBody: $.Parser<$ast.ruleBody> = Alt;
export const Seq: $.Parser<$ast.Seq> = $.loc($.field($.pure("Seq"), "$", $.field($.star($.lazy(() => Sel)), "exprs", $.eps)));
export const Sel: $.Parser<$ast.Sel> = $.loc($.field($.pure("Sel"), "$", $.field($.opt($.lazy(() => selector)), "selector", $.field($.lazy(() => Iter), "expr", $.eps))));
export const Name: $.Parser<$ast.Name> = $.loc($.field($.pure("Name"), "$", $.field(ident, "name", $.right($.str(":"), $.eps))));
export const Choose: $.Parser<$ast.Choose> = $.loc($.field($.pure("Choose"), "$", $.right($.str("@"), $.eps)));
export const selector: $.Parser<$ast.selector> = $.alt(Name, Choose);
export const Iter: $.Parser<$ast.Iter> = $.loc($.field($.pure("Iter"), "$", $.field($.star($.regex<"!" | "&" | "#" | "$">("!&#$", [$.ExpString("!"), $.ExpString("&"), $.ExpString("#"), $.ExpString("$")])), "prefix", $.field($.lazy(() => base), "expr", $.field($.opt($.regex<"*" | "+" | "?">("*+?", [$.ExpString("*"), $.ExpString("+"), $.ExpString("?")])), "suffix", $.eps)))));
export const Apply: $.Parser<$ast.Apply> = $.loc($.field($.pure("Apply"), "$", $.field(ident, "name", $.field($.opt($.lazy(() => params)), "params", $.eps))));
export const Terminal: $.Parser<$ast.Terminal> = $.loc($.field($.pure("Terminal"), "$", $.field($.lazy(() => $string), "value", $.eps)));
export const paren: $.Parser<$ast.paren> = $.right($.str("("), $.left(Alt, $.str(")")));
export const Any: $.Parser<$ast.Any> = $.loc($.field($.pure("Any"), "$", $.right($.str("."), $.eps)));
export const base: $.Parser<$ast.base> = $.alt(Apply, $.alt($.lex($.lazy(() => Class)), $.alt(Terminal, $.alt(paren, Any))));
export const params: $.Parser<$ast.params> = $.right($.str("<"), $.left($.opt($.field(Alt, "head", $.field($.star($.right($.str(","), Alt)), "tail", $.eps))), $.str(">")));
export const Class: $.Parser<$ast.Class> = $.loc($.field($.pure("Class"), "$", $.right($.str("["), $.field($.opt($.str("^")), "negated", $.field($.star($.lazy(() => classSeq)), "seqs", $.right($.str("]"), $.eps))))));
export const Group: $.Parser<$ast.Group> = $.loc($.field($.pure("Group"), "$", $.field($.lazy(() => classChar), "from", $.right($.str("-"), $.field($.lazy(() => classChar), "to", $.eps)))));
export const SpecialClass: $.Parser<$ast.SpecialClass> = $.loc($.field($.pure("SpecialClass"), "$", $.field($.regex<"\\" | string>("\\\\\\]", [$.ExpString("\\"), $.ExpString("\"\\]\"")]), "value", $.eps)));
export const Named: $.Parser<$ast.Named> = $.loc($.field($.pure("Named"), "$", $.field($.regex<"b" | "n" | "r" | "t">("bnrt", [$.ExpString("b"), $.ExpString("n"), $.ExpString("r"), $.ExpString("t")]), "value", $.eps)));
export const Short: $.Parser<$ast.Short> = $.loc($.field($.pure("Short"), "$", $.field($.stry($.right($.lazy(() => hexDigit), $.right($.lazy(() => hexDigit), $.right($.lazy(() => hexDigit), $.right($.lazy(() => hexDigit), $.eps))))), "value", $.eps)));
export const Long: $.Parser<$ast.Long> = $.loc($.field($.pure("Long"), "$", $.right($.str("{"), $.field($.stry($.plus($.lazy(() => hexDigit))), "value", $.right($.str("}"), $.eps)))));
export const unicode: $.Parser<$ast.unicode> = $.right($.str("u"), $.alt(Short, Long));
export const Ascii: $.Parser<$ast.Ascii> = $.loc($.field($.pure("Ascii"), "$", $.right($.str("x"), $.field($.stry($.right($.lazy(() => hexDigit), $.right($.lazy(() => hexDigit), $.eps))), "value", $.eps))));
export const escape: $.Parser<$ast.escape> = $.alt(Named, $.alt(unicode, Ascii));
export const ClassChar: $.Parser<$ast.ClassChar> = $.loc($.field($.pure("ClassChar"), "$", $.field($.regex<"\\" | string>("^\\\\\\]", $.negateExps([$.ExpString("\\"), $.ExpString("\"\\]\"")])), "value", $.eps)));
export const classChar: $.Parser<$ast.classChar> = $.alt($.right($.str("\\"), $.alt(SpecialClass, escape)), ClassChar);
export const classSeq: $.Parser<$ast.classSeq> = $.alt(Group, classChar);
export const $string: $.Parser<$ast.$string> = $.lex($.right($.str("\""), $.left($.star($.lazy(() => $char)), $.str("\""))));
export const Special: $.Parser<$ast.Special> = $.loc($.field($.pure("Special"), "$", $.field($.regex<"\\" | "\"">("\\\\\"", [$.ExpString("\\"), $.ExpString("\"")]), "value", $.eps)));
export const Char: $.Parser<$ast.Char> = $.loc($.field($.pure("Char"), "$", $.field($.regex<"\\" | "\"">("^\\\\\"", $.negateExps([$.ExpString("\\"), $.ExpString("\"")])), "value", $.eps)));
export const $char: $.Parser<$ast.$char> = $.alt($.right($.str("\\"), $.alt(Special, escape)), Char);
export const hexDigit: $.Parser<$ast.hexDigit> = $.regex<string | string | string>("0-9a-fA-F", [$.ExpRange("0", "9"), $.ExpRange("a", "f"), $.ExpRange("A", "F")]);
export const Single: $.Parser<$ast.Single> = $.loc($.field($.pure("Single"), "$", $.right($.str("//"), $.field($.stry($.star($.regex<"\n" | "\r">("^\\n\\r", $.negateExps([$.ExpString("\n"), $.ExpString("\r")])))), "value", $.eps))));
export const Multi: $.Parser<$ast.Multi> = $.loc($.field($.pure("Multi"), "$", $.right($.str("/*"), $.field($.stry($.star($.right($.lookNeg($.str("*/")), $.right($.any, $.eps)))), "value", $.right($.str("*/"), $.eps)))));
export const space: $.Parser<$ast.space> = $.alt($.regex<" " | "\t" | "\n" | "\r">(" \\t\\n\\r", [$.ExpString(" "), $.ExpString("\t"), $.ExpString("\n"), $.ExpString("\r")]), $.alt(Single, Multi));
export const eof: $.Parser<$ast.eof> = $.lookNeg($.any);