import * as $ from "@langtools/runtime";
export declare namespace $$ {
    type idPart$noSkip = string | string | "_";
    type multiLineComment$noSkip = {};
    type singleLineComment$noSkip = {};
    type comment$noSkip = multiLineComment$noSkip | singleLineComment$noSkip;
    type space$noSkip = " " | "\t" | "\r" | "\n" | comment$noSkip;
    type $import = {};
    type nonQuoteOrBackslashChar$noSkip = {};
    type hexDigit$noSkip = string | string;
    type escapeChar$noSkip = "\\" | "\"" | "n" | "r" | "t" | "v" | "b" | "f" | {} | {} | {};
    type escapeSequence$noSkip = {};
    type StringLiteral = {
        readonly $: "StringLiteral";
        readonly value: string;
    };
    type Import = {
        readonly $: "Import";
        readonly path: StringLiteral;
    };
    type primitive = {};
    type TypeId = {
        readonly $: "TypeId";
        readonly name: string;
    };
    type PrimitiveTypeDecl = {
        readonly $: "PrimitiveTypeDecl";
        readonly name: TypeId;
    };
    type mutates = {};
    type $extends = {};
    type virtual = {};
    type override = {};
    type inline = {};
    type $abstract = {};
    type functionAttribute = "get" | mutates | $extends | virtual | override | inline | $abstract;
    type fun = {};
    type fun$noSkip = {};
    type $let$noSkip = {};
    type $return$noSkip = {};
    type receive$noSkip = {};
    type extend$noSkip = {};
    type $native$noSkip = {};
    type primitive$noSkip = {};
    type $public$noSkip = {};
    type $null$noSkip = {};
    type $if$noSkip = {};
    type $else$noSkip = {};
    type $while$noSkip = {};
    type repeat$noSkip = {};
    type $do$noSkip = {};
    type until$noSkip = {};
    type $try$noSkip = {};
    type $catch$noSkip = {};
    type foreach$noSkip = {};
    type $as$noSkip = {};
    type map$noSkip = {};
    type mutates$noSkip = {};
    type $extends$noSkip = {};
    type external$noSkip = {};
    type $import$noSkip = {};
    type $with$noSkip = {};
    type trait$noSkip = {};
    type initOf$noSkip = {};
    type override$noSkip = {};
    type $abstract$noSkip = {};
    type virtual$noSkip = {};
    type inline$noSkip = {};
    type $const$noSkip = {};
    type keyword$noSkip = fun$noSkip | $let$noSkip | $return$noSkip | receive$noSkip | extend$noSkip | $native$noSkip | primitive$noSkip | $public$noSkip | $null$noSkip | $if$noSkip | $else$noSkip | $while$noSkip | repeat$noSkip | $do$noSkip | until$noSkip | $try$noSkip | $catch$noSkip | foreach$noSkip | $as$noSkip | map$noSkip | mutates$noSkip | $extends$noSkip | external$noSkip | $import$noSkip | $with$noSkip | trait$noSkip | initOf$noSkip | override$noSkip | $abstract$noSkip | virtual$noSkip | inline$noSkip | $const$noSkip;
    type reservedWord$noSkip = {};
    type Id = {
        readonly $: "Id";
        readonly name: string;
    };
    type inter<A, B> = {
        readonly head: A;
        readonly tail: readonly {
            readonly op: B;
            readonly right: A;
        }[];
    };
    type TypeOptional = {
        readonly $: "TypeOptional";
        readonly child: TypeId;
    };
    type TypeRegular = {
        readonly $: "TypeRegular";
        readonly child: TypeId;
    };
    type map = {};
    type $as = {};
    type TypeMap = {
        readonly $: "TypeMap";
        readonly key: TypeId;
        readonly keyAs: Id | undefined;
        readonly value: TypeId;
        readonly valueAs: Id | undefined;
    };
    type TypeBounced = {
        readonly $: "TypeBounced";
        readonly child: TypeId;
    };
    type $type = TypeOptional | TypeRegular | TypeMap | TypeBounced;
    type ascription = $type;
    type Parameter = {
        readonly $: "Parameter";
        readonly name: Id;
        readonly type: ascription;
    };
    type parametersFormal = inter<Parameter, ","> | undefined;
    type $let = {};
    type hexDigit = string | string;
    type IntegerLiteralHex = {
        readonly $: "IntegerLiteralHex";
        readonly digits: {};
    };
    type IntegerLiteralBin = {
        readonly $: "IntegerLiteralBin";
        readonly digits: {};
    };
    type IntegerLiteralOct = {
        readonly $: "IntegerLiteralOct";
        readonly digits: {};
    };
    type digit = string;
    type IntegerLiteralDec = {
        readonly $: "IntegerLiteralDec";
        readonly digits: string;
    };
    type integerLiteral = IntegerLiteralHex | IntegerLiteralBin | IntegerLiteralOct | IntegerLiteralDec;
    type idPart = string | string | "_";
    type BoolLiteral = {
        readonly $: "BoolLiteral";
        readonly value: "true" | "false";
    };
    type initOf = {};
    type $null = {};
    type SuffixUnboxNotNull = {
        readonly $: "SuffixUnboxNotNull";
    };
    type SuffixFieldAccess = {
        readonly $: "SuffixFieldAccess";
        readonly name: Id;
    };
    type SuffixCall = {
        readonly $: "SuffixCall";
        readonly params: parametersFactual;
    };
    type suffix = SuffixUnboxNotNull | SuffixCall | SuffixFieldAccess;
    type parametersFactual = inter<expression, ","> | undefined;
    type InitOf = {
        readonly $: "InitOf";
        readonly name: Id;
        readonly params: parametersFactual;
    };
    type structFieldInitializer = {
        readonly name: Id;
        readonly init: expression | undefined;
    };
    type StructInstance = {
        readonly $: "StructInstance";
        readonly fields: inter<structFieldInitializer, ","> | undefined;
    };
    type parens = expression;
    type Parens = {
        readonly $: "Parens";
    };
    type primary = Parens | StructInstance | integerLiteral | BoolLiteral | InitOf | $null | StringLiteral | Id;
    type Suffix = {
        readonly $: "Suffix";
        readonly expression: primary;
        readonly suffixes: readonly suffix[];
    };
    type Unary = {
        readonly $: "Unary";
        readonly prefixes: readonly ("-" | "+" | "!" | "~")[];
        readonly expression: Suffix;
    };
    type Mul = {
        readonly $: "Mul";
    };
    type Add = {
        readonly $: "Add";
    };
    type BitwiseShift = {
        readonly $: "BitwiseShift";
    };
    type Compare = {
        readonly $: "Compare";
    };
    type Equality = {
        readonly $: "Equality";
    };
    type BitwiseAnd = {
        readonly $: "BitwiseAnd";
    };
    type BitwiseXor = {
        readonly $: "BitwiseXor";
    };
    type BitwiseOr = {
        readonly $: "BitwiseOr";
    };
    type And = {
        readonly $: "And";
    };
    type Or = {
        readonly $: "Or";
    };
    type Conditional = {
        readonly $: "Conditional";
        readonly head: Or;
        readonly tail: readonly {
            readonly thenBranch: Or;
            readonly elseBranch: Conditional;
        }[];
    };
    type expression = Conditional;
    type StatementLet = {
        readonly $: "StatementLet";
        readonly name: Id;
        readonly type: ascription | undefined;
        readonly init: expression;
    };
    type $return = {};
    type StatementReturn = {
        readonly $: "StatementReturn";
        readonly expression: expression | undefined;
    };
    type $if = {};
    type $else = {};
    type $while = {};
    type repeat = {};
    type $do = {};
    type until = {};
    type $try = {};
    type $catch = {};
    type foreach = {};
    type StatementExpression = {
        readonly $: "StatementExpression";
        readonly expression: expression;
    };
    type StatementAssign = {
        readonly $: "StatementAssign";
        readonly left: expression;
        readonly operator: "-" | "+" | "*" | "/" | "%" | "|" | "&" | "^" | undefined;
        readonly right: expression;
    };
    type StatementForEach = {
        readonly $: "StatementForEach";
        readonly key: Id;
        readonly value: Id;
        readonly expression: expression;
        readonly body: statements;
    };
    type StatementTry = {
        readonly $: "StatementTry";
        readonly body: statements;
        readonly handler: {
            readonly name: Id;
            readonly body2: statements;
        } | undefined;
    };
    type StatementUntil = {
        readonly $: "StatementUntil";
        readonly body: statements;
        readonly condition: parens;
    };
    type StatementRepeat = {
        readonly $: "StatementRepeat";
        readonly condition: parens;
        readonly body: statements;
    };
    type StatementWhile = {
        readonly $: "StatementWhile";
        readonly condition: parens;
        readonly body: statements;
    };
    type StatementCondition = {
        readonly $: "StatementCondition";
        readonly condition: expression;
        readonly trueBranch: statements;
        readonly falseBranch: {} | undefined;
    };
    type StatementBlock = {
        readonly $: "StatementBlock";
        readonly body: statements;
    };
    type statement = StatementLet | StatementBlock | StatementReturn | StatementCondition | StatementWhile | StatementRepeat | StatementUntil | StatementTry | StatementForEach | StatementExpression | StatementAssign;
    type statements = readonly statement[];
    type FunctionDefinition = {
        readonly $: "FunctionDefinition";
        readonly body: statements;
    };
    type FunctionDeclaration = {
        readonly $: "FunctionDeclaration";
    };
    type Function = {
        readonly $: "Function";
        readonly attributes: readonly functionAttribute[];
        readonly name: Id;
        readonly parameters: parametersFormal;
        readonly type: ascription | undefined;
        readonly body: FunctionDefinition | FunctionDeclaration;
    };
    type AsmData = {
        readonly $: "AsmData";
    };
    type multiLineComment = {};
    type singleLineComment = {};
    type comment = multiLineComment | singleLineComment;
    type space = " " | "\t" | "\r" | "\n" | comment;
    type AsmAny = {
        readonly $: "AsmAny";
    };
    type asmInstruction = AsmData | AsmAny;
    type AsmFunction = {
        readonly $: "AsmFunction";
        readonly shuffle: {
            readonly ids: readonly Id[];
            readonly to: {} | undefined;
        } | undefined;
        readonly attributes: readonly functionAttribute[];
        readonly name: Id;
        readonly parameters: parametersFormal;
        readonly returnType: ascription | undefined;
        readonly instructions: readonly asmInstruction[];
    };
    type funcQuotedId = {};
    type notUnderscore = "_";
    type notArithOperator = "+" | "-" | "*" | "/%" | "/" | "%" | "~/" | "^/" | "~%" | "^%";
    type notComparisonOperator = "<=>" | "<=" | "<" | ">=" | ">" | "!=" | "==";
    type notBitwiseOperator = "~>>" | "~" | "^>>" | "^" | "&" | "|" | "<<" | ">>";
    type notAssignOperator = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "~>>=" | "~/=" | "~%=" | "^>>=" | "^/=" | "^%=" | "^=" | "<<=" | ">>=" | "&=" | "|=";
    type notDelimiter = "[" | "]" | "{" | "}" | "?" | ":";
    type notControlKeyword = "return" | "var" | "repeat" | "do" | "while" | "until" | "try" | "catch" | "ifnot" | "if" | "then" | "elseifnot" | "elseif" | "else";
    type notTypeKeyword = "int" | "cell" | "builder" | "slice" | "cont" | "tuple" | "type" | "->" | "forall";
    type notKeyword = "extern" | "global" | "asm" | "impure" | "inline_ref" | "inline" | "auto_apply" | "method_id" | "operator" | "infixl" | "infixr" | "infix" | "const";
    type notDirective = "#include" | "#pragma";
    type notDecimalNumber = {};
    type notHexadecimalNumber = {};
    type funcInvalidId = notUnderscore | notArithOperator | notComparisonOperator | notBitwiseOperator | notAssignOperator | notDelimiter | notControlKeyword | notTypeKeyword | notKeyword | notDirective | notDecimalNumber | notHexadecimalNumber;
    type whiteSpace = " " | "\t" | "\r" | "\n";
    type funcPlainId = {};
    type funcId = {};
    type $native = {};
    type NativeFunctionDecl = {
        readonly $: "NativeFunctionDecl";
        readonly nativeName: funcId;
        readonly attributes: readonly functionAttribute[];
        readonly name: Id;
        readonly parameters: parametersFormal;
        readonly returnType: ascription | undefined;
    };
    type $const = {};
    type ConstantDefinition = {
        readonly $: "ConstantDefinition";
        readonly expression: expression;
    };
    type ConstantDeclaration = {
        readonly $: "ConstantDeclaration";
    };
    type Constant = {
        readonly $: "Constant";
        readonly attributes: readonly (virtual | override | $abstract)[];
        readonly name: Id;
        readonly type: ascription;
        readonly body: ConstantDefinition | ConstantDeclaration;
    };
    type FieldDecl = {
        readonly $: "FieldDecl";
        readonly name: Id;
        readonly type: ascription;
        readonly as: Id | undefined;
        readonly expression: expression | undefined;
    };
    type structFields = inter<FieldDecl, ";"> | undefined;
    type StructDecl = {
        readonly $: "StructDecl";
        readonly name: TypeId;
        readonly fields: structFields;
    };
    type MessageDecl = {
        readonly $: "MessageDecl";
        readonly id: integerLiteral | undefined;
        readonly name: TypeId;
        readonly fields: structFields;
    };
    type ContractAttribute = {
        readonly $: "ContractAttribute";
    };
    type contract = {};
    type $with = {};
    type InheritedTraits = {
        readonly $: "InheritedTraits";
        readonly ids: inter<Id, ",">;
    };
    type ContractInit = {
        readonly $: "ContractInit";
    };
    type receive = {};
    type receiverParam = Parameter | StringLiteral | undefined;
    type ReceiverReceive = {
        readonly $: "ReceiverReceive";
        readonly param: receiverParam;
        readonly body: statements;
    };
    type external = {};
    type ReceiverExternal = {
        readonly $: "ReceiverExternal";
        readonly param: receiverParam;
        readonly body: statements;
    };
    type ReceiverBounced = {
        readonly $: "ReceiverBounced";
        readonly param: Parameter;
        readonly body: statements;
    };
    type receiver = ReceiverReceive | ReceiverExternal | ReceiverBounced;
    type storageVar = FieldDecl;
    type contractItemDecl = ContractInit | receiver | Function | Constant | storageVar;
    type Contract = {
        readonly $: "Contract";
        readonly attributes: readonly ContractAttribute[];
        readonly name: Id;
        readonly traits: InheritedTraits | undefined;
        readonly items: readonly contractItemDecl[];
    };
    type trait = {};
    type traitItemDecl = receiver | Function | Constant | storageVar;
    type Trait = {
        readonly $: "Trait";
    };
    type moduleItem = PrimitiveTypeDecl | Function | AsmFunction | NativeFunctionDecl | Constant | StructDecl | MessageDecl | Contract | Trait;
    type Module = {
        readonly $: "Module";
        readonly imports: readonly Import[];
        readonly items: readonly moduleItem[];
    };
    type StringLiteral$noSkip = {
        readonly $: "StringLiteral";
        readonly value: string;
    };
    type Import$noSkip = {
        readonly $: "Import";
        readonly path: StringLiteral$noSkip;
    };
    type TypeId$noSkip = {
        readonly $: "TypeId";
        readonly name: string;
    };
    type PrimitiveTypeDecl$noSkip = {
        readonly $: "PrimitiveTypeDecl";
        readonly name: TypeId$noSkip;
    };
    type functionAttribute$noSkip = "get" | mutates$noSkip | $extends$noSkip | virtual$noSkip | override$noSkip | inline$noSkip | $abstract$noSkip;
    type Id$noSkip = {
        readonly $: "Id";
        readonly name: string;
    };
    type inter$noSkip<A, B> = {
        readonly head: A;
        readonly tail: readonly {
            readonly op: B;
            readonly right: A;
        }[];
    };
    type TypeOptional$noSkip = {
        readonly $: "TypeOptional";
        readonly child: TypeId$noSkip;
    };
    type TypeRegular$noSkip = {
        readonly $: "TypeRegular";
        readonly child: TypeId$noSkip;
    };
    type TypeMap$noSkip = {
        readonly $: "TypeMap";
        readonly key: TypeId$noSkip;
        readonly keyAs: Id$noSkip | undefined;
        readonly value: TypeId$noSkip;
        readonly valueAs: Id$noSkip | undefined;
    };
    type TypeBounced$noSkip = {
        readonly $: "TypeBounced";
        readonly child: TypeId$noSkip;
    };
    type $type$noSkip = TypeOptional$noSkip | TypeRegular$noSkip | TypeMap$noSkip | TypeBounced$noSkip;
    type ascription$noSkip = $type$noSkip;
    type Parameter$noSkip = {
        readonly $: "Parameter";
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip;
    };
    type parametersFormal$noSkip = inter$noSkip<Parameter$noSkip, ","> | undefined;
    type IntegerLiteralHex$noSkip = {
        readonly $: "IntegerLiteralHex";
        readonly digits: {};
    };
    type IntegerLiteralBin$noSkip = {
        readonly $: "IntegerLiteralBin";
        readonly digits: {};
    };
    type IntegerLiteralOct$noSkip = {
        readonly $: "IntegerLiteralOct";
        readonly digits: {};
    };
    type digit$noSkip = string;
    type IntegerLiteralDec$noSkip = {
        readonly $: "IntegerLiteralDec";
        readonly digits: string;
    };
    type integerLiteral$noSkip = IntegerLiteralHex$noSkip | IntegerLiteralBin$noSkip | IntegerLiteralOct$noSkip | IntegerLiteralDec$noSkip;
    type BoolLiteral$noSkip = {
        readonly $: "BoolLiteral";
        readonly value: "true" | "false";
    };
    type SuffixUnboxNotNull$noSkip = {
        readonly $: "SuffixUnboxNotNull";
    };
    type SuffixFieldAccess$noSkip = {
        readonly $: "SuffixFieldAccess";
        readonly name: Id$noSkip;
    };
    type SuffixCall$noSkip = {
        readonly $: "SuffixCall";
        readonly params: parametersFactual$noSkip;
    };
    type suffix$noSkip = SuffixUnboxNotNull$noSkip | SuffixCall$noSkip | SuffixFieldAccess$noSkip;
    type parametersFactual$noSkip = inter$noSkip<expression$noSkip, ","> | undefined;
    type InitOf$noSkip = {
        readonly $: "InitOf";
        readonly name: Id$noSkip;
        readonly params: parametersFactual$noSkip;
    };
    type structFieldInitializer$noSkip = {
        readonly name: Id$noSkip;
        readonly init: expression$noSkip | undefined;
    };
    type StructInstance$noSkip = {
        readonly $: "StructInstance";
        readonly fields: inter$noSkip<structFieldInitializer$noSkip, ","> | undefined;
    };
    type parens$noSkip = expression$noSkip;
    type Parens$noSkip = {
        readonly $: "Parens";
    };
    type primary$noSkip = Parens$noSkip | StructInstance$noSkip | integerLiteral$noSkip | BoolLiteral$noSkip | InitOf$noSkip | $null$noSkip | StringLiteral$noSkip | Id$noSkip;
    type Suffix$noSkip = {
        readonly $: "Suffix";
        readonly expression: primary$noSkip;
        readonly suffixes: readonly suffix$noSkip[];
    };
    type Unary$noSkip = {
        readonly $: "Unary";
        readonly prefixes: readonly ("-" | "+" | "!" | "~")[];
        readonly expression: Suffix$noSkip;
    };
    type Mul$noSkip = {
        readonly $: "Mul";
    };
    type Add$noSkip = {
        readonly $: "Add";
    };
    type BitwiseShift$noSkip = {
        readonly $: "BitwiseShift";
    };
    type Compare$noSkip = {
        readonly $: "Compare";
    };
    type Equality$noSkip = {
        readonly $: "Equality";
    };
    type BitwiseAnd$noSkip = {
        readonly $: "BitwiseAnd";
    };
    type BitwiseXor$noSkip = {
        readonly $: "BitwiseXor";
    };
    type BitwiseOr$noSkip = {
        readonly $: "BitwiseOr";
    };
    type And$noSkip = {
        readonly $: "And";
    };
    type Or$noSkip = {
        readonly $: "Or";
    };
    type Conditional$noSkip = {
        readonly $: "Conditional";
        readonly head: Or$noSkip;
        readonly tail: readonly {
            readonly thenBranch: Or$noSkip;
            readonly elseBranch: Conditional$noSkip;
        }[];
    };
    type expression$noSkip = Conditional$noSkip;
    type StatementLet$noSkip = {
        readonly $: "StatementLet";
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip | undefined;
        readonly init: expression$noSkip;
    };
    type StatementReturn$noSkip = {
        readonly $: "StatementReturn";
        readonly expression: expression$noSkip | undefined;
    };
    type StatementExpression$noSkip = {
        readonly $: "StatementExpression";
        readonly expression: expression$noSkip;
    };
    type StatementAssign$noSkip = {
        readonly $: "StatementAssign";
        readonly left: expression$noSkip;
        readonly operator: "-" | "+" | "*" | "/" | "%" | "|" | "&" | "^" | undefined;
        readonly right: expression$noSkip;
    };
    type StatementForEach$noSkip = {
        readonly $: "StatementForEach";
        readonly key: Id$noSkip;
        readonly value: Id$noSkip;
        readonly expression: expression$noSkip;
        readonly body: statements$noSkip;
    };
    type StatementTry$noSkip = {
        readonly $: "StatementTry";
        readonly body: statements$noSkip;
        readonly handler: {
            readonly name: Id$noSkip;
            readonly body2: statements$noSkip;
        } | undefined;
    };
    type StatementUntil$noSkip = {
        readonly $: "StatementUntil";
        readonly body: statements$noSkip;
        readonly condition: parens$noSkip;
    };
    type StatementRepeat$noSkip = {
        readonly $: "StatementRepeat";
        readonly condition: parens$noSkip;
        readonly body: statements$noSkip;
    };
    type StatementWhile$noSkip = {
        readonly $: "StatementWhile";
        readonly condition: parens$noSkip;
        readonly body: statements$noSkip;
    };
    type StatementCondition$noSkip = {
        readonly $: "StatementCondition";
        readonly condition: expression$noSkip;
        readonly trueBranch: statements$noSkip;
        readonly falseBranch: {} | undefined;
    };
    type StatementBlock$noSkip = {
        readonly $: "StatementBlock";
        readonly body: statements$noSkip;
    };
    type statement$noSkip = StatementLet$noSkip | StatementBlock$noSkip | StatementReturn$noSkip | StatementCondition$noSkip | StatementWhile$noSkip | StatementRepeat$noSkip | StatementUntil$noSkip | StatementTry$noSkip | StatementForEach$noSkip | StatementExpression$noSkip | StatementAssign$noSkip;
    type statements$noSkip = readonly statement$noSkip[];
    type FunctionDefinition$noSkip = {
        readonly $: "FunctionDefinition";
        readonly body: statements$noSkip;
    };
    type FunctionDeclaration$noSkip = {
        readonly $: "FunctionDeclaration";
    };
    type Function$noSkip = {
        readonly $: "Function";
        readonly attributes: readonly functionAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly parameters: parametersFormal$noSkip;
        readonly type: ascription$noSkip | undefined;
        readonly body: FunctionDefinition$noSkip | FunctionDeclaration$noSkip;
    };
    type AsmData$noSkip = {
        readonly $: "AsmData";
    };
    type AsmAny$noSkip = {
        readonly $: "AsmAny";
    };
    type asmInstruction$noSkip = AsmData$noSkip | AsmAny$noSkip;
    type AsmFunction$noSkip = {
        readonly $: "AsmFunction";
        readonly shuffle: {
            readonly ids: readonly Id$noSkip[];
            readonly to: {} | undefined;
        } | undefined;
        readonly attributes: readonly functionAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly parameters: parametersFormal$noSkip;
        readonly returnType: ascription$noSkip | undefined;
        readonly instructions: readonly asmInstruction$noSkip[];
    };
    type funcQuotedId$noSkip = {};
    type notUnderscore$noSkip = "_";
    type notArithOperator$noSkip = "+" | "-" | "*" | "/%" | "/" | "%" | "~/" | "^/" | "~%" | "^%";
    type notComparisonOperator$noSkip = "<=>" | "<=" | "<" | ">=" | ">" | "!=" | "==";
    type notBitwiseOperator$noSkip = "~>>" | "~" | "^>>" | "^" | "&" | "|" | "<<" | ">>";
    type notAssignOperator$noSkip = "=" | "+=" | "-=" | "*=" | "/=" | "%=" | "~>>=" | "~/=" | "~%=" | "^>>=" | "^/=" | "^%=" | "^=" | "<<=" | ">>=" | "&=" | "|=";
    type notDelimiter$noSkip = "[" | "]" | "{" | "}" | "?" | ":";
    type notControlKeyword$noSkip = "return" | "var" | "repeat" | "do" | "while" | "until" | "try" | "catch" | "ifnot" | "if" | "then" | "elseifnot" | "elseif" | "else";
    type notTypeKeyword$noSkip = "int" | "cell" | "builder" | "slice" | "cont" | "tuple" | "type" | "->" | "forall";
    type notKeyword$noSkip = "extern" | "global" | "asm" | "impure" | "inline_ref" | "inline" | "auto_apply" | "method_id" | "operator" | "infixl" | "infixr" | "infix" | "const";
    type notDirective$noSkip = "#include" | "#pragma";
    type notDecimalNumber$noSkip = {};
    type notHexadecimalNumber$noSkip = {};
    type funcInvalidId$noSkip = notUnderscore$noSkip | notArithOperator$noSkip | notComparisonOperator$noSkip | notBitwiseOperator$noSkip | notAssignOperator$noSkip | notDelimiter$noSkip | notControlKeyword$noSkip | notTypeKeyword$noSkip | notKeyword$noSkip | notDirective$noSkip | notDecimalNumber$noSkip | notHexadecimalNumber$noSkip;
    type whiteSpace$noSkip = " " | "\t" | "\r" | "\n";
    type funcPlainId$noSkip = {};
    type funcId$noSkip = {};
    type NativeFunctionDecl$noSkip = {
        readonly $: "NativeFunctionDecl";
        readonly nativeName: funcId$noSkip;
        readonly attributes: readonly functionAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly parameters: parametersFormal$noSkip;
        readonly returnType: ascription$noSkip | undefined;
    };
    type ConstantDefinition$noSkip = {
        readonly $: "ConstantDefinition";
        readonly expression: expression$noSkip;
    };
    type ConstantDeclaration$noSkip = {
        readonly $: "ConstantDeclaration";
    };
    type Constant$noSkip = {
        readonly $: "Constant";
        readonly attributes: readonly (virtual$noSkip | override$noSkip | $abstract$noSkip)[];
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip;
        readonly body: ConstantDefinition$noSkip | ConstantDeclaration$noSkip;
    };
    type FieldDecl$noSkip = {
        readonly $: "FieldDecl";
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip;
        readonly as: Id$noSkip | undefined;
        readonly expression: expression$noSkip | undefined;
    };
    type structFields$noSkip = inter$noSkip<FieldDecl$noSkip, ";"> | undefined;
    type StructDecl$noSkip = {
        readonly $: "StructDecl";
        readonly name: TypeId$noSkip;
        readonly fields: structFields$noSkip;
    };
    type MessageDecl$noSkip = {
        readonly $: "MessageDecl";
        readonly id: integerLiteral$noSkip | undefined;
        readonly name: TypeId$noSkip;
        readonly fields: structFields$noSkip;
    };
    type ContractAttribute$noSkip = {
        readonly $: "ContractAttribute";
    };
    type contract$noSkip = {};
    type InheritedTraits$noSkip = {
        readonly $: "InheritedTraits";
        readonly ids: inter$noSkip<Id$noSkip, ",">;
    };
    type ContractInit$noSkip = {
        readonly $: "ContractInit";
    };
    type receiverParam$noSkip = Parameter$noSkip | StringLiteral$noSkip | undefined;
    type ReceiverReceive$noSkip = {
        readonly $: "ReceiverReceive";
        readonly param: receiverParam$noSkip;
        readonly body: statements$noSkip;
    };
    type ReceiverExternal$noSkip = {
        readonly $: "ReceiverExternal";
        readonly param: receiverParam$noSkip;
        readonly body: statements$noSkip;
    };
    type ReceiverBounced$noSkip = {
        readonly $: "ReceiverBounced";
        readonly param: Parameter$noSkip;
        readonly body: statements$noSkip;
    };
    type receiver$noSkip = ReceiverReceive$noSkip | ReceiverExternal$noSkip | ReceiverBounced$noSkip;
    type storageVar$noSkip = FieldDecl$noSkip;
    type contractItemDecl$noSkip = ContractInit$noSkip | receiver$noSkip | Function$noSkip | Constant$noSkip | storageVar$noSkip;
    type Contract$noSkip = {
        readonly $: "Contract";
        readonly attributes: readonly ContractAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly traits: InheritedTraits$noSkip | undefined;
        readonly items: readonly contractItemDecl$noSkip[];
    };
    type traitItemDecl$noSkip = receiver$noSkip | Function$noSkip | Constant$noSkip | storageVar$noSkip;
    type Trait$noSkip = {
        readonly $: "Trait";
    };
    type moduleItem$noSkip = PrimitiveTypeDecl$noSkip | Function$noSkip | AsmFunction$noSkip | NativeFunctionDecl$noSkip | Constant$noSkip | StructDecl$noSkip | MessageDecl$noSkip | Contract$noSkip | Trait$noSkip;
    type Module$noSkip = {
        readonly $: "Module";
        readonly imports: readonly Import$noSkip[];
        readonly items: readonly moduleItem$noSkip[];
    };
    type nonQuoteOrBackslashChar = {};
    type escapeChar = "\\" | "\"" | "n" | "r" | "t" | "v" | "b" | "f" | {} | {} | {};
    type escapeSequence = {};
    type extend = {};
    type $public = {};
    type keyword = fun | $let | $return | receive | extend | $native | primitive | $public | $null | $if | $else | $while | repeat | $do | until | $try | $catch | foreach | $as | map | mutates | $extends | external | $import | $with | trait | initOf | override | $abstract | virtual | inline | $const;
    type reservedWord = {};
    type JustImports = {
        readonly $: "JustImports";
        readonly imports: readonly Import[];
    };
    type JustImports$noSkip = {
        readonly $: "JustImports";
        readonly imports: readonly Import$noSkip[];
    };
}
export declare const idPart$noSkip: $.Parser<$$.idPart$noSkip>;
export declare const multiLineComment$noSkip: $.Parser<$$.multiLineComment$noSkip>;
export declare const singleLineComment$noSkip: $.Parser<$$.singleLineComment$noSkip>;
export declare const comment$noSkip: $.Parser<$$.comment$noSkip>;
export declare const space$noSkip: $.Parser<$$.space$noSkip>;
export declare const $import: $.Parser<$$.$import>;
export declare const nonQuoteOrBackslashChar$noSkip: $.Parser<$$.nonQuoteOrBackslashChar$noSkip>;
export declare const hexDigit$noSkip: $.Parser<$$.hexDigit$noSkip>;
export declare const escapeChar$noSkip: $.Parser<$$.escapeChar$noSkip>;
export declare const escapeSequence$noSkip: $.Parser<$$.escapeSequence$noSkip>;
export declare const StringLiteral: $.Parser<$$.StringLiteral>;
export declare const Import: $.Parser<$$.Import>;
export declare const primitive: $.Parser<$$.primitive>;
export declare const TypeId: $.Parser<$$.TypeId>;
export declare const PrimitiveTypeDecl: $.Parser<$$.PrimitiveTypeDecl>;
export declare const mutates: $.Parser<$$.mutates>;
export declare const $extends: $.Parser<$$.$extends>;
export declare const virtual: $.Parser<$$.virtual>;
export declare const override: $.Parser<$$.override>;
export declare const inline: $.Parser<$$.inline>;
export declare const $abstract: $.Parser<$$.$abstract>;
export declare const functionAttribute: $.Parser<$$.functionAttribute>;
export declare const fun: $.Parser<$$.fun>;
export declare const fun$noSkip: $.Parser<$$.fun$noSkip>;
export declare const $let$noSkip: $.Parser<$$.$let$noSkip>;
export declare const $return$noSkip: $.Parser<$$.$return$noSkip>;
export declare const receive$noSkip: $.Parser<$$.receive$noSkip>;
export declare const extend$noSkip: $.Parser<$$.extend$noSkip>;
export declare const $native$noSkip: $.Parser<$$.$native$noSkip>;
export declare const primitive$noSkip: $.Parser<$$.primitive$noSkip>;
export declare const $public$noSkip: $.Parser<$$.$public$noSkip>;
export declare const $null$noSkip: $.Parser<$$.$null$noSkip>;
export declare const $if$noSkip: $.Parser<$$.$if$noSkip>;
export declare const $else$noSkip: $.Parser<$$.$else$noSkip>;
export declare const $while$noSkip: $.Parser<$$.$while$noSkip>;
export declare const repeat$noSkip: $.Parser<$$.repeat$noSkip>;
export declare const $do$noSkip: $.Parser<$$.$do$noSkip>;
export declare const until$noSkip: $.Parser<$$.until$noSkip>;
export declare const $try$noSkip: $.Parser<$$.$try$noSkip>;
export declare const $catch$noSkip: $.Parser<$$.$catch$noSkip>;
export declare const foreach$noSkip: $.Parser<$$.foreach$noSkip>;
export declare const $as$noSkip: $.Parser<$$.$as$noSkip>;
export declare const map$noSkip: $.Parser<$$.map$noSkip>;
export declare const mutates$noSkip: $.Parser<$$.mutates$noSkip>;
export declare const $extends$noSkip: $.Parser<$$.$extends$noSkip>;
export declare const external$noSkip: $.Parser<$$.external$noSkip>;
export declare const $import$noSkip: $.Parser<$$.$import$noSkip>;
export declare const $with$noSkip: $.Parser<$$.$with$noSkip>;
export declare const trait$noSkip: $.Parser<$$.trait$noSkip>;
export declare const initOf$noSkip: $.Parser<$$.initOf$noSkip>;
export declare const override$noSkip: $.Parser<$$.override$noSkip>;
export declare const $abstract$noSkip: $.Parser<$$.$abstract$noSkip>;
export declare const virtual$noSkip: $.Parser<$$.virtual$noSkip>;
export declare const inline$noSkip: $.Parser<$$.inline$noSkip>;
export declare const $const$noSkip: $.Parser<$$.$const$noSkip>;
export declare const keyword$noSkip: $.Parser<$$.keyword$noSkip>;
export declare const reservedWord$noSkip: $.Parser<$$.reservedWord$noSkip>;
export declare const Id: $.Parser<$$.Id>;
export declare const inter: <A, B>(A: $.Parser<A>, B: $.Parser<B>) => $.Parser<$$.inter<A, B>>;
export declare const TypeOptional: $.Parser<$$.TypeOptional>;
export declare const TypeRegular: $.Parser<$$.TypeRegular>;
export declare const map: $.Parser<$$.map>;
export declare const $as: $.Parser<$$.$as>;
export declare const TypeMap: $.Parser<$$.TypeMap>;
export declare const TypeBounced: $.Parser<$$.TypeBounced>;
export declare const $type: $.Parser<$$.$type>;
export declare const ascription: $.Parser<$$.ascription>;
export declare const Parameter: $.Parser<$$.Parameter>;
export declare const parametersFormal: $.Parser<$$.parametersFormal>;
export declare const $let: $.Parser<$$.$let>;
export declare const hexDigit: $.Parser<$$.hexDigit>;
export declare const IntegerLiteralHex: $.Parser<$$.IntegerLiteralHex>;
export declare const IntegerLiteralBin: $.Parser<$$.IntegerLiteralBin>;
export declare const IntegerLiteralOct: $.Parser<$$.IntegerLiteralOct>;
export declare const digit: $.Parser<$$.digit>;
export declare const IntegerLiteralDec: $.Parser<$$.IntegerLiteralDec>;
export declare const integerLiteral: $.Parser<$$.integerLiteral>;
export declare const idPart: $.Parser<$$.idPart>;
export declare const BoolLiteral: $.Parser<$$.BoolLiteral>;
export declare const initOf: $.Parser<$$.initOf>;
export declare const $null: $.Parser<$$.$null>;
export declare const SuffixUnboxNotNull: $.Parser<$$.SuffixUnboxNotNull>;
export declare const SuffixFieldAccess: $.Parser<$$.SuffixFieldAccess>;
export declare const SuffixCall: $.Parser<$$.SuffixCall>;
export declare const suffix: $.Parser<$$.suffix>;
export declare const parametersFactual: $.Parser<$$.parametersFactual>;
export declare const InitOf: $.Parser<$$.InitOf>;
export declare const structFieldInitializer: $.Parser<$$.structFieldInitializer>;
export declare const StructInstance: $.Parser<$$.StructInstance>;
export declare const parens: $.Parser<$$.parens>;
export declare const Parens: $.Parser<$$.Parens>;
export declare const primary: $.Parser<$$.primary>;
export declare const Suffix: $.Parser<$$.Suffix>;
export declare const Unary: $.Parser<$$.Unary>;
export declare const Mul: $.Parser<$$.Mul>;
export declare const Add: $.Parser<$$.Add>;
export declare const BitwiseShift: $.Parser<$$.BitwiseShift>;
export declare const Compare: $.Parser<$$.Compare>;
export declare const Equality: $.Parser<$$.Equality>;
export declare const BitwiseAnd: $.Parser<$$.BitwiseAnd>;
export declare const BitwiseXor: $.Parser<$$.BitwiseXor>;
export declare const BitwiseOr: $.Parser<$$.BitwiseOr>;
export declare const And: $.Parser<$$.And>;
export declare const Or: $.Parser<$$.Or>;
export declare const Conditional: $.Parser<$$.Conditional>;
export declare const expression: $.Parser<$$.expression>;
export declare const StatementLet: $.Parser<$$.StatementLet>;
export declare const $return: $.Parser<$$.$return>;
export declare const StatementReturn: $.Parser<$$.StatementReturn>;
export declare const $if: $.Parser<$$.$if>;
export declare const $else: $.Parser<$$.$else>;
export declare const $while: $.Parser<$$.$while>;
export declare const repeat: $.Parser<$$.repeat>;
export declare const $do: $.Parser<$$.$do>;
export declare const until: $.Parser<$$.until>;
export declare const $try: $.Parser<$$.$try>;
export declare const $catch: $.Parser<$$.$catch>;
export declare const foreach: $.Parser<$$.foreach>;
export declare const StatementExpression: $.Parser<$$.StatementExpression>;
export declare const StatementAssign: $.Parser<$$.StatementAssign>;
export declare const StatementForEach: $.Parser<$$.StatementForEach>;
export declare const StatementTry: $.Parser<$$.StatementTry>;
export declare const StatementUntil: $.Parser<$$.StatementUntil>;
export declare const StatementRepeat: $.Parser<$$.StatementRepeat>;
export declare const StatementWhile: $.Parser<$$.StatementWhile>;
export declare const StatementCondition: $.Parser<$$.StatementCondition>;
export declare const StatementBlock: $.Parser<$$.StatementBlock>;
export declare const statement: $.Parser<$$.statement>;
export declare const statements: $.Parser<$$.statements>;
export declare const FunctionDefinition: $.Parser<$$.FunctionDefinition>;
export declare const FunctionDeclaration: $.Parser<$$.FunctionDeclaration>;
export declare const Function: $.Parser<$$.Function>;
export declare const AsmData: $.Parser<$$.AsmData>;
export declare const multiLineComment: $.Parser<$$.multiLineComment>;
export declare const singleLineComment: $.Parser<$$.singleLineComment>;
export declare const comment: $.Parser<$$.comment>;
export declare const space: $.Parser<$$.space>;
export declare const AsmAny: $.Parser<$$.AsmAny>;
export declare const asmInstruction: $.Parser<$$.asmInstruction>;
export declare const AsmFunction: $.Parser<$$.AsmFunction>;
export declare const funcQuotedId: $.Parser<$$.funcQuotedId>;
export declare const notUnderscore: $.Parser<$$.notUnderscore>;
export declare const notArithOperator: $.Parser<$$.notArithOperator>;
export declare const notComparisonOperator: $.Parser<$$.notComparisonOperator>;
export declare const notBitwiseOperator: $.Parser<$$.notBitwiseOperator>;
export declare const notAssignOperator: $.Parser<$$.notAssignOperator>;
export declare const notDelimiter: $.Parser<$$.notDelimiter>;
export declare const notControlKeyword: $.Parser<$$.notControlKeyword>;
export declare const notTypeKeyword: $.Parser<$$.notTypeKeyword>;
export declare const notKeyword: $.Parser<$$.notKeyword>;
export declare const notDirective: $.Parser<$$.notDirective>;
export declare const notDecimalNumber: $.Parser<$$.notDecimalNumber>;
export declare const notHexadecimalNumber: $.Parser<$$.notHexadecimalNumber>;
export declare const funcInvalidId: $.Parser<$$.funcInvalidId>;
export declare const whiteSpace: $.Parser<$$.whiteSpace>;
export declare const funcPlainId: $.Parser<$$.funcPlainId>;
export declare const funcId: $.Parser<$$.funcId>;
export declare const $native: $.Parser<$$.$native>;
export declare const NativeFunctionDecl: $.Parser<$$.NativeFunctionDecl>;
export declare const $const: $.Parser<$$.$const>;
export declare const ConstantDefinition: $.Parser<$$.ConstantDefinition>;
export declare const ConstantDeclaration: $.Parser<$$.ConstantDeclaration>;
export declare const Constant: $.Parser<$$.Constant>;
export declare const FieldDecl: $.Parser<$$.FieldDecl>;
export declare const structFields: $.Parser<$$.structFields>;
export declare const StructDecl: $.Parser<$$.StructDecl>;
export declare const MessageDecl: $.Parser<$$.MessageDecl>;
export declare const ContractAttribute: $.Parser<$$.ContractAttribute>;
export declare const contract: $.Parser<$$.contract>;
export declare const $with: $.Parser<$$.$with>;
export declare const InheritedTraits: $.Parser<$$.InheritedTraits>;
export declare const ContractInit: $.Parser<$$.ContractInit>;
export declare const receive: $.Parser<$$.receive>;
export declare const receiverParam: $.Parser<$$.receiverParam>;
export declare const ReceiverReceive: $.Parser<$$.ReceiverReceive>;
export declare const external: $.Parser<$$.external>;
export declare const ReceiverExternal: $.Parser<$$.ReceiverExternal>;
export declare const ReceiverBounced: $.Parser<$$.ReceiverBounced>;
export declare const receiver: $.Parser<$$.receiver>;
export declare const storageVar: $.Parser<$$.storageVar>;
export declare const contractItemDecl: $.Parser<$$.contractItemDecl>;
export declare const Contract: $.Parser<$$.Contract>;
export declare const trait: $.Parser<$$.trait>;
export declare const traitItemDecl: $.Parser<$$.traitItemDecl>;
export declare const Trait: $.Parser<$$.Trait>;
export declare const moduleItem: $.Parser<$$.moduleItem>;
export declare const Module: $.Parser<$$.Module>;
export declare const StringLiteral$noSkip: $.Parser<$$.StringLiteral$noSkip>;
export declare const Import$noSkip: $.Parser<$$.Import$noSkip>;
export declare const TypeId$noSkip: $.Parser<$$.TypeId$noSkip>;
export declare const PrimitiveTypeDecl$noSkip: $.Parser<$$.PrimitiveTypeDecl$noSkip>;
export declare const functionAttribute$noSkip: $.Parser<$$.functionAttribute$noSkip>;
export declare const Id$noSkip: $.Parser<$$.Id$noSkip>;
export declare const inter$noSkip: <A, B>(A: $.Parser<A>, B: $.Parser<B>) => $.Parser<$$.inter$noSkip<A, B>>;
export declare const TypeOptional$noSkip: $.Parser<$$.TypeOptional$noSkip>;
export declare const TypeRegular$noSkip: $.Parser<$$.TypeRegular$noSkip>;
export declare const TypeMap$noSkip: $.Parser<$$.TypeMap$noSkip>;
export declare const TypeBounced$noSkip: $.Parser<$$.TypeBounced$noSkip>;
export declare const $type$noSkip: $.Parser<$$.$type$noSkip>;
export declare const ascription$noSkip: $.Parser<$$.ascription$noSkip>;
export declare const Parameter$noSkip: $.Parser<$$.Parameter$noSkip>;
export declare const parametersFormal$noSkip: $.Parser<$$.parametersFormal$noSkip>;
export declare const IntegerLiteralHex$noSkip: $.Parser<$$.IntegerLiteralHex$noSkip>;
export declare const IntegerLiteralBin$noSkip: $.Parser<$$.IntegerLiteralBin$noSkip>;
export declare const IntegerLiteralOct$noSkip: $.Parser<$$.IntegerLiteralOct$noSkip>;
export declare const digit$noSkip: $.Parser<$$.digit$noSkip>;
export declare const IntegerLiteralDec$noSkip: $.Parser<$$.IntegerLiteralDec$noSkip>;
export declare const integerLiteral$noSkip: $.Parser<$$.integerLiteral$noSkip>;
export declare const BoolLiteral$noSkip: $.Parser<$$.BoolLiteral$noSkip>;
export declare const SuffixUnboxNotNull$noSkip: $.Parser<$$.SuffixUnboxNotNull$noSkip>;
export declare const SuffixFieldAccess$noSkip: $.Parser<$$.SuffixFieldAccess$noSkip>;
export declare const SuffixCall$noSkip: $.Parser<$$.SuffixCall$noSkip>;
export declare const suffix$noSkip: $.Parser<$$.suffix$noSkip>;
export declare const parametersFactual$noSkip: $.Parser<$$.parametersFactual$noSkip>;
export declare const InitOf$noSkip: $.Parser<$$.InitOf$noSkip>;
export declare const structFieldInitializer$noSkip: $.Parser<$$.structFieldInitializer$noSkip>;
export declare const StructInstance$noSkip: $.Parser<$$.StructInstance$noSkip>;
export declare const parens$noSkip: $.Parser<$$.parens$noSkip>;
export declare const Parens$noSkip: $.Parser<$$.Parens$noSkip>;
export declare const primary$noSkip: $.Parser<$$.primary$noSkip>;
export declare const Suffix$noSkip: $.Parser<$$.Suffix$noSkip>;
export declare const Unary$noSkip: $.Parser<$$.Unary$noSkip>;
export declare const Mul$noSkip: $.Parser<$$.Mul$noSkip>;
export declare const Add$noSkip: $.Parser<$$.Add$noSkip>;
export declare const BitwiseShift$noSkip: $.Parser<$$.BitwiseShift$noSkip>;
export declare const Compare$noSkip: $.Parser<$$.Compare$noSkip>;
export declare const Equality$noSkip: $.Parser<$$.Equality$noSkip>;
export declare const BitwiseAnd$noSkip: $.Parser<$$.BitwiseAnd$noSkip>;
export declare const BitwiseXor$noSkip: $.Parser<$$.BitwiseXor$noSkip>;
export declare const BitwiseOr$noSkip: $.Parser<$$.BitwiseOr$noSkip>;
export declare const And$noSkip: $.Parser<$$.And$noSkip>;
export declare const Or$noSkip: $.Parser<$$.Or$noSkip>;
export declare const Conditional$noSkip: $.Parser<$$.Conditional$noSkip>;
export declare const expression$noSkip: $.Parser<$$.expression$noSkip>;
export declare const StatementLet$noSkip: $.Parser<$$.StatementLet$noSkip>;
export declare const StatementReturn$noSkip: $.Parser<$$.StatementReturn$noSkip>;
export declare const StatementExpression$noSkip: $.Parser<$$.StatementExpression$noSkip>;
export declare const StatementAssign$noSkip: $.Parser<$$.StatementAssign$noSkip>;
export declare const StatementForEach$noSkip: $.Parser<$$.StatementForEach$noSkip>;
export declare const StatementTry$noSkip: $.Parser<$$.StatementTry$noSkip>;
export declare const StatementUntil$noSkip: $.Parser<$$.StatementUntil$noSkip>;
export declare const StatementRepeat$noSkip: $.Parser<$$.StatementRepeat$noSkip>;
export declare const StatementWhile$noSkip: $.Parser<$$.StatementWhile$noSkip>;
export declare const StatementCondition$noSkip: $.Parser<$$.StatementCondition$noSkip>;
export declare const StatementBlock$noSkip: $.Parser<$$.StatementBlock$noSkip>;
export declare const statement$noSkip: $.Parser<$$.statement$noSkip>;
export declare const statements$noSkip: $.Parser<$$.statements$noSkip>;
export declare const FunctionDefinition$noSkip: $.Parser<$$.FunctionDefinition$noSkip>;
export declare const FunctionDeclaration$noSkip: $.Parser<$$.FunctionDeclaration$noSkip>;
export declare const Function$noSkip: $.Parser<$$.Function$noSkip>;
export declare const AsmData$noSkip: $.Parser<$$.AsmData$noSkip>;
export declare const AsmAny$noSkip: $.Parser<$$.AsmAny$noSkip>;
export declare const asmInstruction$noSkip: $.Parser<$$.asmInstruction$noSkip>;
export declare const AsmFunction$noSkip: $.Parser<$$.AsmFunction$noSkip>;
export declare const funcQuotedId$noSkip: $.Parser<$$.funcQuotedId$noSkip>;
export declare const notUnderscore$noSkip: $.Parser<$$.notUnderscore$noSkip>;
export declare const notArithOperator$noSkip: $.Parser<$$.notArithOperator$noSkip>;
export declare const notComparisonOperator$noSkip: $.Parser<$$.notComparisonOperator$noSkip>;
export declare const notBitwiseOperator$noSkip: $.Parser<$$.notBitwiseOperator$noSkip>;
export declare const notAssignOperator$noSkip: $.Parser<$$.notAssignOperator$noSkip>;
export declare const notDelimiter$noSkip: $.Parser<$$.notDelimiter$noSkip>;
export declare const notControlKeyword$noSkip: $.Parser<$$.notControlKeyword$noSkip>;
export declare const notTypeKeyword$noSkip: $.Parser<$$.notTypeKeyword$noSkip>;
export declare const notKeyword$noSkip: $.Parser<$$.notKeyword$noSkip>;
export declare const notDirective$noSkip: $.Parser<$$.notDirective$noSkip>;
export declare const notDecimalNumber$noSkip: $.Parser<$$.notDecimalNumber$noSkip>;
export declare const notHexadecimalNumber$noSkip: $.Parser<$$.notHexadecimalNumber$noSkip>;
export declare const funcInvalidId$noSkip: $.Parser<$$.funcInvalidId$noSkip>;
export declare const whiteSpace$noSkip: $.Parser<$$.whiteSpace$noSkip>;
export declare const funcPlainId$noSkip: $.Parser<$$.funcPlainId$noSkip>;
export declare const funcId$noSkip: $.Parser<$$.funcId$noSkip>;
export declare const NativeFunctionDecl$noSkip: $.Parser<$$.NativeFunctionDecl$noSkip>;
export declare const ConstantDefinition$noSkip: $.Parser<$$.ConstantDefinition$noSkip>;
export declare const ConstantDeclaration$noSkip: $.Parser<$$.ConstantDeclaration$noSkip>;
export declare const Constant$noSkip: $.Parser<$$.Constant$noSkip>;
export declare const FieldDecl$noSkip: $.Parser<$$.FieldDecl$noSkip>;
export declare const structFields$noSkip: $.Parser<$$.structFields$noSkip>;
export declare const StructDecl$noSkip: $.Parser<$$.StructDecl$noSkip>;
export declare const MessageDecl$noSkip: $.Parser<$$.MessageDecl$noSkip>;
export declare const ContractAttribute$noSkip: $.Parser<$$.ContractAttribute$noSkip>;
export declare const contract$noSkip: $.Parser<$$.contract$noSkip>;
export declare const InheritedTraits$noSkip: $.Parser<$$.InheritedTraits$noSkip>;
export declare const ContractInit$noSkip: $.Parser<$$.ContractInit$noSkip>;
export declare const receiverParam$noSkip: $.Parser<$$.receiverParam$noSkip>;
export declare const ReceiverReceive$noSkip: $.Parser<$$.ReceiverReceive$noSkip>;
export declare const ReceiverExternal$noSkip: $.Parser<$$.ReceiverExternal$noSkip>;
export declare const ReceiverBounced$noSkip: $.Parser<$$.ReceiverBounced$noSkip>;
export declare const receiver$noSkip: $.Parser<$$.receiver$noSkip>;
export declare const storageVar$noSkip: $.Parser<$$.storageVar$noSkip>;
export declare const contractItemDecl$noSkip: $.Parser<$$.contractItemDecl$noSkip>;
export declare const Contract$noSkip: $.Parser<$$.Contract$noSkip>;
export declare const traitItemDecl$noSkip: $.Parser<$$.traitItemDecl$noSkip>;
export declare const Trait$noSkip: $.Parser<$$.Trait$noSkip>;
export declare const moduleItem$noSkip: $.Parser<$$.moduleItem$noSkip>;
export declare const Module$noSkip: $.Parser<$$.Module$noSkip>;
export declare const nonQuoteOrBackslashChar: $.Parser<$$.nonQuoteOrBackslashChar>;
export declare const escapeChar: $.Parser<$$.escapeChar>;
export declare const escapeSequence: $.Parser<$$.escapeSequence>;
export declare const extend: $.Parser<$$.extend>;
export declare const $public: $.Parser<$$.$public>;
export declare const keyword: $.Parser<$$.keyword>;
export declare const reservedWord: $.Parser<$$.reservedWord>;
export declare const JustImports: $.Parser<$$.JustImports>;
export declare const JustImports$noSkip: $.Parser<$$.JustImports$noSkip>;
//# sourceMappingURL=grammar.d.ts.map