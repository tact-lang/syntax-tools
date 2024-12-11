import * as $ from "@langtools/runtime";
export declare namespace $$ {
    type Module = $.Located<{
        readonly $: "Module";
        readonly imports: readonly Import[];
        readonly items: readonly moduleItem[];
    }>;
    type Module$noSkip = $.Located<{
        readonly $: "Module";
        readonly imports: readonly Import$noSkip[];
        readonly items: readonly moduleItem$noSkip[];
    }>;
    type Import = $.Located<{
        readonly $: "Import";
        readonly path: StringLiteral;
    }>;
    type Import$noSkip = $.Located<{
        readonly $: "Import";
        readonly path: StringLiteral$noSkip;
    }>;
    type PrimitiveTypeDecl = $.Located<{
        readonly $: "PrimitiveTypeDecl";
        readonly name: TypeId;
    }>;
    type Function = $.Located<{
        readonly $: "Function";
        readonly attributes: readonly functionAttribute[];
        readonly name: Id;
        readonly parameters: parametersFormal;
        readonly type: ascription | undefined;
        readonly body: FunctionDefinition | FunctionDeclaration;
    }>;
    type AsmFunction = $.Located<{
        readonly $: "AsmFunction";
        readonly shuffle: {
            readonly ids: readonly Id[];
            readonly to: readonly IntegerLiteralDec[] | undefined;
        } | undefined;
        readonly attributes: readonly functionAttribute[];
        readonly name: Id;
        readonly parameters: parametersFormal;
        readonly returnType: ascription | undefined;
        readonly instructions: readonly asmInstruction[];
    }>;
    type NativeFunctionDecl = $.Located<{
        readonly $: "NativeFunctionDecl";
        readonly nativeName: funcId;
        readonly attributes: readonly functionAttribute[];
        readonly name: Id;
        readonly parameters: parametersFormal;
        readonly returnType: ascription | undefined;
    }>;
    type Constant = $.Located<{
        readonly $: "Constant";
        readonly attributes: readonly (virtual | override | $abstract)[];
        readonly name: Id;
        readonly type: ascription;
        readonly body: ConstantDefinition | ConstantDeclaration;
    }>;
    type StructDecl = $.Located<{
        readonly $: "StructDecl";
        readonly name: TypeId;
        readonly fields: structFields;
    }>;
    type MessageDecl = $.Located<{
        readonly $: "MessageDecl";
        readonly id: integerLiteral | undefined;
        readonly name: TypeId;
        readonly fields: structFields;
    }>;
    type Contract = $.Located<{
        readonly $: "Contract";
        readonly attributes: readonly ContractAttribute[];
        readonly name: Id;
        readonly traits: InheritedTraits | undefined;
        readonly items: readonly contractItemDecl[];
    }>;
    type Trait = $.Located<{
        readonly $: "Trait";
    }>;
    type moduleItem = PrimitiveTypeDecl | Function | AsmFunction | NativeFunctionDecl | Constant | StructDecl | MessageDecl | Contract | Trait;
    type PrimitiveTypeDecl$noSkip = $.Located<{
        readonly $: "PrimitiveTypeDecl";
        readonly name: TypeId$noSkip;
    }>;
    type Function$noSkip = $.Located<{
        readonly $: "Function";
        readonly attributes: readonly functionAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly parameters: parametersFormal$noSkip;
        readonly type: ascription$noSkip | undefined;
        readonly body: FunctionDefinition$noSkip | FunctionDeclaration$noSkip;
    }>;
    type AsmFunction$noSkip = $.Located<{
        readonly $: "AsmFunction";
        readonly shuffle: {
            readonly ids: readonly Id$noSkip[];
            readonly to: readonly IntegerLiteralDec$noSkip[] | undefined;
        } | undefined;
        readonly attributes: readonly functionAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly parameters: parametersFormal$noSkip;
        readonly returnType: ascription$noSkip | undefined;
        readonly instructions: readonly asmInstruction$noSkip[];
    }>;
    type NativeFunctionDecl$noSkip = $.Located<{
        readonly $: "NativeFunctionDecl";
        readonly nativeName: funcId$noSkip;
        readonly attributes: readonly functionAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly parameters: parametersFormal$noSkip;
        readonly returnType: ascription$noSkip | undefined;
    }>;
    type Constant$noSkip = $.Located<{
        readonly $: "Constant";
        readonly attributes: readonly (virtual$noSkip | override$noSkip | $abstract$noSkip)[];
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip;
        readonly body: ConstantDefinition$noSkip | ConstantDeclaration$noSkip;
    }>;
    type StructDecl$noSkip = $.Located<{
        readonly $: "StructDecl";
        readonly name: TypeId$noSkip;
        readonly fields: structFields$noSkip;
    }>;
    type MessageDecl$noSkip = $.Located<{
        readonly $: "MessageDecl";
        readonly id: integerLiteral$noSkip | undefined;
        readonly name: TypeId$noSkip;
        readonly fields: structFields$noSkip;
    }>;
    type Contract$noSkip = $.Located<{
        readonly $: "Contract";
        readonly attributes: readonly ContractAttribute$noSkip[];
        readonly name: Id$noSkip;
        readonly traits: InheritedTraits$noSkip | undefined;
        readonly items: readonly contractItemDecl$noSkip[];
    }>;
    type Trait$noSkip = $.Located<{
        readonly $: "Trait";
    }>;
    type moduleItem$noSkip = PrimitiveTypeDecl$noSkip | Function$noSkip | AsmFunction$noSkip | NativeFunctionDecl$noSkip | Constant$noSkip | StructDecl$noSkip | MessageDecl$noSkip | Contract$noSkip | Trait$noSkip;
    type ContractInit = $.Located<{
        readonly $: "ContractInit";
    }>;
    type ReceiverReceive = $.Located<{
        readonly $: "ReceiverReceive";
        readonly param: receiverParam;
        readonly body: statements;
    }>;
    type ReceiverExternal = $.Located<{
        readonly $: "ReceiverExternal";
        readonly param: receiverParam;
        readonly body: statements;
    }>;
    type ReceiverBounced = $.Located<{
        readonly $: "ReceiverBounced";
        readonly param: Parameter;
        readonly body: statements;
    }>;
    type receiver = ReceiverReceive | ReceiverExternal | ReceiverBounced;
    type FieldDecl = $.Located<{
        readonly $: "FieldDecl";
        readonly name: Id;
        readonly type: ascription;
        readonly as: Id | undefined;
        readonly expression: expression | undefined;
    }>;
    type multiLineComment$noSkip = string;
    type singleLineComment$noSkip = string;
    type comment$noSkip = multiLineComment$noSkip | singleLineComment$noSkip;
    type space$noSkip = " " | "\t" | "\r" | "\n" | comment$noSkip;
    type storageVar = FieldDecl;
    type contractItemDecl = ContractInit | receiver | Function | Constant | storageVar;
    type ContractInit$noSkip = $.Located<{
        readonly $: "ContractInit";
    }>;
    type ReceiverReceive$noSkip = $.Located<{
        readonly $: "ReceiverReceive";
        readonly param: receiverParam$noSkip;
        readonly body: statements$noSkip;
    }>;
    type ReceiverExternal$noSkip = $.Located<{
        readonly $: "ReceiverExternal";
        readonly param: receiverParam$noSkip;
        readonly body: statements$noSkip;
    }>;
    type ReceiverBounced$noSkip = $.Located<{
        readonly $: "ReceiverBounced";
        readonly param: Parameter$noSkip;
        readonly body: statements$noSkip;
    }>;
    type receiver$noSkip = ReceiverReceive$noSkip | ReceiverExternal$noSkip | ReceiverBounced$noSkip;
    type FieldDecl$noSkip = $.Located<{
        readonly $: "FieldDecl";
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip;
        readonly as: Id$noSkip | undefined;
        readonly expression: expression$noSkip | undefined;
    }>;
    type storageVar$noSkip = FieldDecl$noSkip;
    type contractItemDecl$noSkip = ContractInit$noSkip | receiver$noSkip | Function$noSkip | Constant$noSkip | storageVar$noSkip;
    type traitItemDecl = receiver | Function | Constant | storageVar;
    type traitItemDecl$noSkip = receiver$noSkip | Function$noSkip | Constant$noSkip | storageVar$noSkip;
    type FunctionDefinition = $.Located<{
        readonly $: "FunctionDefinition";
        readonly body: statements;
    }>;
    type FunctionDefinition$noSkip = $.Located<{
        readonly $: "FunctionDefinition";
        readonly body: statements$noSkip;
    }>;
    type FunctionDeclaration = $.Located<{
        readonly $: "FunctionDeclaration";
    }>;
    type FunctionDeclaration$noSkip = $.Located<{
        readonly $: "FunctionDeclaration";
    }>;
    type ConstantDefinition = $.Located<{
        readonly $: "ConstantDefinition";
        readonly expression: expression;
    }>;
    type ConstantDefinition$noSkip = $.Located<{
        readonly $: "ConstantDefinition";
        readonly expression: expression$noSkip;
    }>;
    type ConstantDeclaration = $.Located<{
        readonly $: "ConstantDeclaration";
    }>;
    type ConstantDeclaration$noSkip = $.Located<{
        readonly $: "ConstantDeclaration";
    }>;
    type inter<A, B> = {
        readonly head: A;
        readonly tail: readonly {
            readonly op: B;
            readonly right: A;
        }[];
    };
    type structFields = inter<FieldDecl, ";"> | undefined;
    type inter$noSkip<A, B> = {
        readonly head: A;
        readonly tail: readonly {
            readonly op: B;
            readonly right: A;
        }[];
    };
    type structFields$noSkip = inter$noSkip<FieldDecl$noSkip, ";"> | undefined;
    type InheritedTraits = $.Located<{
        readonly $: "InheritedTraits";
        readonly ids: inter<Id, ",">;
    }>;
    type InheritedTraits$noSkip = $.Located<{
        readonly $: "InheritedTraits";
        readonly ids: inter$noSkip<Id$noSkip, ",">;
    }>;
    type ContractAttribute = $.Located<{
        readonly $: "ContractAttribute";
    }>;
    type ContractAttribute$noSkip = $.Located<{
        readonly $: "ContractAttribute";
    }>;
    type idPart$noSkip = string | string | "_";
    type mutates = "mutates";
    type $extends = "extends";
    type virtual = "virtual";
    type override = "override";
    type inline = "inline";
    type $abstract = "abstract";
    type functionAttribute = "get" | mutates | $extends | virtual | override | inline | $abstract;
    type mutates$noSkip = "mutates";
    type $extends$noSkip = "extends";
    type virtual$noSkip = "virtual";
    type override$noSkip = "override";
    type inline$noSkip = "inline";
    type $abstract$noSkip = "abstract";
    type functionAttribute$noSkip = "get" | mutates$noSkip | $extends$noSkip | virtual$noSkip | override$noSkip | inline$noSkip | $abstract$noSkip;
    type Parameter = $.Located<{
        readonly $: "Parameter";
        readonly name: Id;
        readonly type: ascription;
    }>;
    type StringLiteral = $.Located<{
        readonly $: "StringLiteral";
        readonly value: string;
    }>;
    type receiverParam = Parameter | StringLiteral | undefined;
    type Parameter$noSkip = $.Located<{
        readonly $: "Parameter";
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip;
    }>;
    type StringLiteral$noSkip = $.Located<{
        readonly $: "StringLiteral";
        readonly value: string;
    }>;
    type receiverParam$noSkip = Parameter$noSkip | StringLiteral$noSkip | undefined;
    type AsmData = $.Located<{
        readonly $: "AsmData";
    }>;
    type AsmAny = $.Located<{
        readonly $: "AsmAny";
    }>;
    type asmInstruction = AsmData | AsmAny;
    type AsmData$noSkip = $.Located<{
        readonly $: "AsmData";
    }>;
    type AsmAny$noSkip = $.Located<{
        readonly $: "AsmAny";
    }>;
    type asmInstruction$noSkip = AsmData$noSkip | AsmAny$noSkip;
    type TypeOptional = $.Located<{
        readonly $: "TypeOptional";
        readonly child: TypeId;
    }>;
    type TypeRegular = $.Located<{
        readonly $: "TypeRegular";
        readonly child: TypeId;
    }>;
    type TypeMap = $.Located<{
        readonly $: "TypeMap";
        readonly key: TypeId;
        readonly keyAs: Id | undefined;
        readonly value: TypeId;
        readonly valueAs: Id | undefined;
    }>;
    type TypeBounced = $.Located<{
        readonly $: "TypeBounced";
        readonly child: TypeId;
    }>;
    type $type = TypeOptional | TypeRegular | TypeMap | TypeBounced;
    type ascription = $type;
    type TypeOptional$noSkip = $.Located<{
        readonly $: "TypeOptional";
        readonly child: TypeId$noSkip;
    }>;
    type TypeRegular$noSkip = $.Located<{
        readonly $: "TypeRegular";
        readonly child: TypeId$noSkip;
    }>;
    type TypeMap$noSkip = $.Located<{
        readonly $: "TypeMap";
        readonly key: TypeId$noSkip;
        readonly keyAs: Id$noSkip | undefined;
        readonly value: TypeId$noSkip;
        readonly valueAs: Id$noSkip | undefined;
    }>;
    type TypeBounced$noSkip = $.Located<{
        readonly $: "TypeBounced";
        readonly child: TypeId$noSkip;
    }>;
    type $type$noSkip = TypeOptional$noSkip | TypeRegular$noSkip | TypeMap$noSkip | TypeBounced$noSkip;
    type ascription$noSkip = $type$noSkip;
    type TypeId = $.Located<{
        readonly $: "TypeId";
        readonly name: string;
    }>;
    type TypeId$noSkip = $.Located<{
        readonly $: "TypeId";
        readonly name: string;
    }>;
    type StatementLet = $.Located<{
        readonly $: "StatementLet";
        readonly name: Id;
        readonly type: ascription | undefined;
        readonly init: expression;
    }>;
    type StatementBlock = $.Located<{
        readonly $: "StatementBlock";
        readonly body: statements;
    }>;
    type StatementReturn = $.Located<{
        readonly $: "StatementReturn";
        readonly expression: expression | undefined;
    }>;
    type StatementCondition = $.Located<{
        readonly $: "StatementCondition";
        readonly condition: expression;
        readonly trueBranch: statements;
        readonly falseBranch: statements | StatementCondition | undefined;
    }>;
    type StatementWhile = $.Located<{
        readonly $: "StatementWhile";
        readonly condition: parens;
        readonly body: statements;
    }>;
    type StatementRepeat = $.Located<{
        readonly $: "StatementRepeat";
        readonly condition: parens;
        readonly body: statements;
    }>;
    type StatementUntil = $.Located<{
        readonly $: "StatementUntil";
        readonly body: statements;
        readonly condition: parens;
    }>;
    type StatementTry = $.Located<{
        readonly $: "StatementTry";
        readonly body: statements;
        readonly handler: {
            readonly name: Id;
            readonly body2: statements;
        } | undefined;
    }>;
    type StatementForEach = $.Located<{
        readonly $: "StatementForEach";
        readonly key: Id;
        readonly value: Id;
        readonly expression: expression;
        readonly body: statements;
    }>;
    type StatementExpression = $.Located<{
        readonly $: "StatementExpression";
        readonly expression: expression;
    }>;
    type StatementAssign = $.Located<{
        readonly $: "StatementAssign";
        readonly left: expression;
        readonly operator: "-" | "+" | "*" | "/" | "%" | "|" | "&" | "^" | undefined;
        readonly right: expression;
    }>;
    type statement = StatementLet | StatementBlock | StatementReturn | StatementCondition | StatementWhile | StatementRepeat | StatementUntil | StatementTry | StatementForEach | StatementExpression | StatementAssign;
    type StatementLet$noSkip = $.Located<{
        readonly $: "StatementLet";
        readonly name: Id$noSkip;
        readonly type: ascription$noSkip | undefined;
        readonly init: expression$noSkip;
    }>;
    type StatementBlock$noSkip = $.Located<{
        readonly $: "StatementBlock";
        readonly body: statements$noSkip;
    }>;
    type StatementReturn$noSkip = $.Located<{
        readonly $: "StatementReturn";
        readonly expression: expression$noSkip | undefined;
    }>;
    type StatementCondition$noSkip = $.Located<{
        readonly $: "StatementCondition";
        readonly condition: expression$noSkip;
        readonly trueBranch: statements$noSkip;
        readonly falseBranch: statements$noSkip | StatementCondition$noSkip | undefined;
    }>;
    type StatementWhile$noSkip = $.Located<{
        readonly $: "StatementWhile";
        readonly condition: parens$noSkip;
        readonly body: statements$noSkip;
    }>;
    type StatementRepeat$noSkip = $.Located<{
        readonly $: "StatementRepeat";
        readonly condition: parens$noSkip;
        readonly body: statements$noSkip;
    }>;
    type StatementUntil$noSkip = $.Located<{
        readonly $: "StatementUntil";
        readonly body: statements$noSkip;
        readonly condition: parens$noSkip;
    }>;
    type StatementTry$noSkip = $.Located<{
        readonly $: "StatementTry";
        readonly body: statements$noSkip;
        readonly handler: {
            readonly name: Id$noSkip;
            readonly body2: statements$noSkip;
        } | undefined;
    }>;
    type StatementForEach$noSkip = $.Located<{
        readonly $: "StatementForEach";
        readonly key: Id$noSkip;
        readonly value: Id$noSkip;
        readonly expression: expression$noSkip;
        readonly body: statements$noSkip;
    }>;
    type StatementExpression$noSkip = $.Located<{
        readonly $: "StatementExpression";
        readonly expression: expression$noSkip;
    }>;
    type StatementAssign$noSkip = $.Located<{
        readonly $: "StatementAssign";
        readonly left: expression$noSkip;
        readonly operator: "-" | "+" | "*" | "/" | "%" | "|" | "&" | "^" | undefined;
        readonly right: expression$noSkip;
    }>;
    type statement$noSkip = StatementLet$noSkip | StatementBlock$noSkip | StatementReturn$noSkip | StatementCondition$noSkip | StatementWhile$noSkip | StatementRepeat$noSkip | StatementUntil$noSkip | StatementTry$noSkip | StatementForEach$noSkip | StatementExpression$noSkip | StatementAssign$noSkip;
    type statements = readonly statement[];
    type statements$noSkip = readonly statement$noSkip[];
    type Conditional = $.Located<{
        readonly $: "Conditional";
        readonly head: Or;
        readonly tail: readonly {
            readonly thenBranch: Or;
            readonly elseBranch: Conditional;
        }[];
    }>;
    type expression = Conditional;
    type Conditional$noSkip = $.Located<{
        readonly $: "Conditional";
        readonly head: Or$noSkip;
        readonly tail: readonly {
            readonly thenBranch: Or$noSkip;
            readonly elseBranch: Conditional$noSkip;
        }[];
    }>;
    type expression$noSkip = Conditional$noSkip;
    type Or = $.Located<{
        readonly $: "Or";
    }>;
    type Or$noSkip = $.Located<{
        readonly $: "Or";
    }>;
    type And = $.Located<{
        readonly $: "And";
    }>;
    type And$noSkip = $.Located<{
        readonly $: "And";
    }>;
    type BitwiseOr = $.Located<{
        readonly $: "BitwiseOr";
    }>;
    type BitwiseOr$noSkip = $.Located<{
        readonly $: "BitwiseOr";
    }>;
    type BitwiseXor = $.Located<{
        readonly $: "BitwiseXor";
    }>;
    type BitwiseXor$noSkip = $.Located<{
        readonly $: "BitwiseXor";
    }>;
    type BitwiseAnd = $.Located<{
        readonly $: "BitwiseAnd";
    }>;
    type BitwiseAnd$noSkip = $.Located<{
        readonly $: "BitwiseAnd";
    }>;
    type Equality = $.Located<{
        readonly $: "Equality";
    }>;
    type Equality$noSkip = $.Located<{
        readonly $: "Equality";
    }>;
    type Compare = $.Located<{
        readonly $: "Compare";
    }>;
    type Compare$noSkip = $.Located<{
        readonly $: "Compare";
    }>;
    type BitwiseShift = $.Located<{
        readonly $: "BitwiseShift";
    }>;
    type BitwiseShift$noSkip = $.Located<{
        readonly $: "BitwiseShift";
    }>;
    type Add = $.Located<{
        readonly $: "Add";
    }>;
    type Add$noSkip = $.Located<{
        readonly $: "Add";
    }>;
    type Mul = $.Located<{
        readonly $: "Mul";
    }>;
    type Mul$noSkip = $.Located<{
        readonly $: "Mul";
    }>;
    type Unary = $.Located<{
        readonly $: "Unary";
        readonly prefixes: readonly ("-" | "+" | "!" | "~")[];
        readonly expression: Suffix;
    }>;
    type Unary$noSkip = $.Located<{
        readonly $: "Unary";
        readonly prefixes: readonly ("-" | "+" | "!" | "~")[];
        readonly expression: Suffix$noSkip;
    }>;
    type Suffix = $.Located<{
        readonly $: "Suffix";
        readonly expression: primary;
        readonly suffixes: readonly suffix[];
    }>;
    type Suffix$noSkip = $.Located<{
        readonly $: "Suffix";
        readonly expression: primary$noSkip;
        readonly suffixes: readonly suffix$noSkip[];
    }>;
    type SuffixUnboxNotNull = $.Located<{
        readonly $: "SuffixUnboxNotNull";
    }>;
    type SuffixCall = $.Located<{
        readonly $: "SuffixCall";
        readonly params: parametersFactual;
    }>;
    type SuffixFieldAccess = $.Located<{
        readonly $: "SuffixFieldAccess";
        readonly name: Id;
    }>;
    type suffix = SuffixUnboxNotNull | SuffixCall | SuffixFieldAccess;
    type SuffixUnboxNotNull$noSkip = $.Located<{
        readonly $: "SuffixUnboxNotNull";
    }>;
    type SuffixCall$noSkip = $.Located<{
        readonly $: "SuffixCall";
        readonly params: parametersFactual$noSkip;
    }>;
    type SuffixFieldAccess$noSkip = $.Located<{
        readonly $: "SuffixFieldAccess";
        readonly name: Id$noSkip;
    }>;
    type suffix$noSkip = SuffixUnboxNotNull$noSkip | SuffixCall$noSkip | SuffixFieldAccess$noSkip;
    type Parens = $.Located<{
        readonly $: "Parens";
    }>;
    type StructInstance = $.Located<{
        readonly $: "StructInstance";
        readonly fields: inter<structFieldInitializer, ","> | undefined;
    }>;
    type IntegerLiteralHex = $.Located<{
        readonly $: "IntegerLiteralHex";
        readonly digits: string;
    }>;
    type IntegerLiteralBin = $.Located<{
        readonly $: "IntegerLiteralBin";
        readonly digits: string;
    }>;
    type IntegerLiteralOct = $.Located<{
        readonly $: "IntegerLiteralOct";
        readonly digits: string;
    }>;
    type IntegerLiteralDec = $.Located<{
        readonly $: "IntegerLiteralDec";
        readonly digits: string;
    }>;
    type integerLiteral = IntegerLiteralHex | IntegerLiteralBin | IntegerLiteralOct | IntegerLiteralDec;
    type BoolLiteral = $.Located<{
        readonly $: "BoolLiteral";
        readonly value: "true" | "false";
    }>;
    type InitOf = $.Located<{
        readonly $: "InitOf";
        readonly name: Id;
        readonly params: parametersFactual;
    }>;
    type $null = "null";
    type Id = $.Located<{
        readonly $: "Id";
        readonly name: string;
    }>;
    type primary = Parens | StructInstance | integerLiteral | BoolLiteral | InitOf | $null | StringLiteral | Id;
    type Parens$noSkip = $.Located<{
        readonly $: "Parens";
    }>;
    type StructInstance$noSkip = $.Located<{
        readonly $: "StructInstance";
        readonly fields: inter$noSkip<structFieldInitializer$noSkip, ","> | undefined;
    }>;
    type IntegerLiteralHex$noSkip = $.Located<{
        readonly $: "IntegerLiteralHex";
        readonly digits: string;
    }>;
    type IntegerLiteralBin$noSkip = $.Located<{
        readonly $: "IntegerLiteralBin";
        readonly digits: string;
    }>;
    type IntegerLiteralOct$noSkip = $.Located<{
        readonly $: "IntegerLiteralOct";
        readonly digits: string;
    }>;
    type IntegerLiteralDec$noSkip = $.Located<{
        readonly $: "IntegerLiteralDec";
        readonly digits: string;
    }>;
    type integerLiteral$noSkip = IntegerLiteralHex$noSkip | IntegerLiteralBin$noSkip | IntegerLiteralOct$noSkip | IntegerLiteralDec$noSkip;
    type BoolLiteral$noSkip = $.Located<{
        readonly $: "BoolLiteral";
        readonly value: "true" | "false";
    }>;
    type InitOf$noSkip = $.Located<{
        readonly $: "InitOf";
        readonly name: Id$noSkip;
        readonly params: parametersFactual$noSkip;
    }>;
    type $null$noSkip = "null";
    type Id$noSkip = $.Located<{
        readonly $: "Id";
        readonly name: string;
    }>;
    type primary$noSkip = Parens$noSkip | StructInstance$noSkip | integerLiteral$noSkip | BoolLiteral$noSkip | InitOf$noSkip | $null$noSkip | StringLiteral$noSkip | Id$noSkip;
    type parens = expression;
    type parens$noSkip = expression$noSkip;
    type structFieldInitializer = {
        readonly name: Id;
        readonly init: expression | undefined;
    };
    type structFieldInitializer$noSkip = {
        readonly name: Id$noSkip;
        readonly init: expression$noSkip | undefined;
    };
    type parametersFactual = inter<expression, ","> | undefined;
    type parametersFactual$noSkip = inter$noSkip<expression$noSkip, ","> | undefined;
    type parametersFormal = inter<Parameter, ","> | undefined;
    type parametersFormal$noSkip = inter$noSkip<Parameter$noSkip, ","> | undefined;
    type idPart = string | string | "_";
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
    type digit = string;
    type notDecimalNumber = string;
    type hexDigit = string | string;
    type notHexadecimalNumber = string;
    type funcInvalidId = notUnderscore | notArithOperator | notComparisonOperator | notBitwiseOperator | notAssignOperator | notDelimiter | notControlKeyword | notTypeKeyword | notKeyword | notDirective | notDecimalNumber | notHexadecimalNumber;
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
    type digit$noSkip = string;
    type notDecimalNumber$noSkip = string;
    type hexDigit$noSkip = string | string;
    type notHexadecimalNumber$noSkip = string;
    type funcInvalidId$noSkip = notUnderscore$noSkip | notArithOperator$noSkip | notComparisonOperator$noSkip | notBitwiseOperator$noSkip | notAssignOperator$noSkip | notDelimiter$noSkip | notControlKeyword$noSkip | notTypeKeyword$noSkip | notKeyword$noSkip | notDirective$noSkip | notDecimalNumber$noSkip | notHexadecimalNumber$noSkip;
    type whiteSpace = " " | "\t" | "\r" | "\n";
    type funcPlainId = string;
    type whiteSpace$noSkip = " " | "\t" | "\r" | "\n";
    type funcPlainId$noSkip = string;
    type funcQuotedId = string;
    type funcQuotedId$noSkip = string;
    type funcId = {
        readonly accessor: "." | "~" | undefined;
        readonly id: funcQuotedId | funcPlainId;
    };
    type funcId$noSkip = {
        readonly accessor: "." | "~" | undefined;
        readonly id: funcQuotedId$noSkip | funcPlainId$noSkip;
    };
    type escapeChar = "\\" | "\"" | "n" | "r" | "t" | "v" | "b" | "f" | string | string | string;
    type escapeChar$noSkip = "\\" | "\"" | "n" | "r" | "t" | "v" | "b" | "f" | string | string | string;
    type fun = "fun";
    type $let = "let";
    type $return = "return";
    type receive = "receive";
    type extend = "extend";
    type $native = "native";
    type primitive = "primitive";
    type $public = "public";
    type $if = "if";
    type $else = "else";
    type $while = "while";
    type repeat = "repeat";
    type $do = "do";
    type until = "until";
    type $try = "try";
    type $catch = "catch";
    type foreach = "foreach";
    type $as = "as";
    type map = "map";
    type external = "external";
    type $import = "import";
    type $with = "with";
    type trait = "trait";
    type initOf = "initOf";
    type $const = "const";
    type keyword = fun | $let | $return | receive | extend | $native | primitive | $public | $null | $if | $else | $while | repeat | $do | until | $try | $catch | foreach | $as | map | mutates | $extends | external | $import | $with | trait | initOf | override | $abstract | virtual | inline | $const;
    type reservedWord = keyword;
    type fun$noSkip = "fun";
    type $let$noSkip = "let";
    type $return$noSkip = "return";
    type receive$noSkip = "receive";
    type extend$noSkip = "extend";
    type $native$noSkip = "native";
    type primitive$noSkip = "primitive";
    type $public$noSkip = "public";
    type $if$noSkip = "if";
    type $else$noSkip = "else";
    type $while$noSkip = "while";
    type repeat$noSkip = "repeat";
    type $do$noSkip = "do";
    type until$noSkip = "until";
    type $try$noSkip = "try";
    type $catch$noSkip = "catch";
    type foreach$noSkip = "foreach";
    type $as$noSkip = "as";
    type map$noSkip = "map";
    type external$noSkip = "external";
    type $import$noSkip = "import";
    type $with$noSkip = "with";
    type trait$noSkip = "trait";
    type initOf$noSkip = "initOf";
    type $const$noSkip = "const";
    type keyword$noSkip = fun$noSkip | $let$noSkip | $return$noSkip | receive$noSkip | extend$noSkip | $native$noSkip | primitive$noSkip | $public$noSkip | $null$noSkip | $if$noSkip | $else$noSkip | $while$noSkip | repeat$noSkip | $do$noSkip | until$noSkip | $try$noSkip | $catch$noSkip | foreach$noSkip | $as$noSkip | map$noSkip | mutates$noSkip | $extends$noSkip | external$noSkip | $import$noSkip | $with$noSkip | trait$noSkip | initOf$noSkip | override$noSkip | $abstract$noSkip | virtual$noSkip | inline$noSkip | $const$noSkip;
    type reservedWord$noSkip = keyword$noSkip;
    type contract = "contract";
    type contract$noSkip = "contract";
    type multiLineComment = string;
    type singleLineComment = string;
    type comment = multiLineComment | singleLineComment;
    type space = " " | "\t" | "\r" | "\n" | comment;
    type JustImports = $.Located<{
        readonly $: "JustImports";
        readonly imports: readonly Import[];
    }>;
    type JustImports$noSkip = $.Located<{
        readonly $: "JustImports";
        readonly imports: readonly Import$noSkip[];
    }>;
}
export declare const Module: $.Parser<$$.Module>;
export declare const Module$noSkip: $.Parser<$$.Module$noSkip>;
export declare const Import: $.Parser<$$.Import>;
export declare const Import$noSkip: $.Parser<$$.Import$noSkip>;
export declare const PrimitiveTypeDecl: $.Parser<$$.PrimitiveTypeDecl>;
export declare const Function: $.Parser<$$.Function>;
export declare const AsmFunction: $.Parser<$$.AsmFunction>;
export declare const NativeFunctionDecl: $.Parser<$$.NativeFunctionDecl>;
export declare const Constant: $.Parser<$$.Constant>;
export declare const StructDecl: $.Parser<$$.StructDecl>;
export declare const MessageDecl: $.Parser<$$.MessageDecl>;
export declare const Contract: $.Parser<$$.Contract>;
export declare const Trait: $.Parser<$$.Trait>;
export declare const moduleItem: $.Parser<$$.moduleItem>;
export declare const PrimitiveTypeDecl$noSkip: $.Parser<$$.PrimitiveTypeDecl$noSkip>;
export declare const Function$noSkip: $.Parser<$$.Function$noSkip>;
export declare const AsmFunction$noSkip: $.Parser<$$.AsmFunction$noSkip>;
export declare const NativeFunctionDecl$noSkip: $.Parser<$$.NativeFunctionDecl$noSkip>;
export declare const Constant$noSkip: $.Parser<$$.Constant$noSkip>;
export declare const StructDecl$noSkip: $.Parser<$$.StructDecl$noSkip>;
export declare const MessageDecl$noSkip: $.Parser<$$.MessageDecl$noSkip>;
export declare const Contract$noSkip: $.Parser<$$.Contract$noSkip>;
export declare const Trait$noSkip: $.Parser<$$.Trait$noSkip>;
export declare const moduleItem$noSkip: $.Parser<$$.moduleItem$noSkip>;
export declare const ContractInit: $.Parser<$$.ContractInit>;
export declare const ReceiverReceive: $.Parser<$$.ReceiverReceive>;
export declare const ReceiverExternal: $.Parser<$$.ReceiverExternal>;
export declare const ReceiverBounced: $.Parser<$$.ReceiverBounced>;
export declare const receiver: $.Parser<$$.receiver>;
export declare const FieldDecl: $.Parser<$$.FieldDecl>;
export declare const multiLineComment$noSkip: $.Parser<$$.multiLineComment$noSkip>;
export declare const singleLineComment$noSkip: $.Parser<$$.singleLineComment$noSkip>;
export declare const comment$noSkip: $.Parser<$$.comment$noSkip>;
export declare const space$noSkip: $.Parser<$$.space$noSkip>;
export declare const storageVar: $.Parser<$$.storageVar>;
export declare const contractItemDecl: $.Parser<$$.contractItemDecl>;
export declare const ContractInit$noSkip: $.Parser<$$.ContractInit$noSkip>;
export declare const ReceiverReceive$noSkip: $.Parser<$$.ReceiverReceive$noSkip>;
export declare const ReceiverExternal$noSkip: $.Parser<$$.ReceiverExternal$noSkip>;
export declare const ReceiverBounced$noSkip: $.Parser<$$.ReceiverBounced$noSkip>;
export declare const receiver$noSkip: $.Parser<$$.receiver$noSkip>;
export declare const FieldDecl$noSkip: $.Parser<$$.FieldDecl$noSkip>;
export declare const storageVar$noSkip: $.Parser<$$.storageVar$noSkip>;
export declare const contractItemDecl$noSkip: $.Parser<$$.contractItemDecl$noSkip>;
export declare const traitItemDecl: $.Parser<$$.traitItemDecl>;
export declare const traitItemDecl$noSkip: $.Parser<$$.traitItemDecl$noSkip>;
export declare const FunctionDefinition: $.Parser<$$.FunctionDefinition>;
export declare const FunctionDefinition$noSkip: $.Parser<$$.FunctionDefinition$noSkip>;
export declare const FunctionDeclaration: $.Parser<$$.FunctionDeclaration>;
export declare const FunctionDeclaration$noSkip: $.Parser<$$.FunctionDeclaration$noSkip>;
export declare const ConstantDefinition: $.Parser<$$.ConstantDefinition>;
export declare const ConstantDefinition$noSkip: $.Parser<$$.ConstantDefinition$noSkip>;
export declare const ConstantDeclaration: $.Parser<$$.ConstantDeclaration>;
export declare const ConstantDeclaration$noSkip: $.Parser<$$.ConstantDeclaration$noSkip>;
export declare const inter: <A, B>(A: $.Parser<A>, B: $.Parser<B>) => $.Parser<$$.inter<A, B>>;
export declare const structFields: $.Parser<$$.structFields>;
export declare const inter$noSkip: <A, B>(A: $.Parser<A>, B: $.Parser<B>) => $.Parser<$$.inter$noSkip<A, B>>;
export declare const structFields$noSkip: $.Parser<$$.structFields$noSkip>;
export declare const InheritedTraits: $.Parser<$$.InheritedTraits>;
export declare const InheritedTraits$noSkip: $.Parser<$$.InheritedTraits$noSkip>;
export declare const ContractAttribute: $.Parser<$$.ContractAttribute>;
export declare const ContractAttribute$noSkip: $.Parser<$$.ContractAttribute$noSkip>;
export declare const idPart$noSkip: $.Parser<$$.idPart$noSkip>;
export declare const mutates: $.Parser<$$.mutates>;
export declare const $extends: $.Parser<$$.$extends>;
export declare const virtual: $.Parser<$$.virtual>;
export declare const override: $.Parser<$$.override>;
export declare const inline: $.Parser<$$.inline>;
export declare const $abstract: $.Parser<$$.$abstract>;
export declare const functionAttribute: $.Parser<$$.functionAttribute>;
export declare const mutates$noSkip: $.Parser<$$.mutates$noSkip>;
export declare const $extends$noSkip: $.Parser<$$.$extends$noSkip>;
export declare const virtual$noSkip: $.Parser<$$.virtual$noSkip>;
export declare const override$noSkip: $.Parser<$$.override$noSkip>;
export declare const inline$noSkip: $.Parser<$$.inline$noSkip>;
export declare const $abstract$noSkip: $.Parser<$$.$abstract$noSkip>;
export declare const functionAttribute$noSkip: $.Parser<$$.functionAttribute$noSkip>;
export declare const Parameter: $.Parser<$$.Parameter>;
export declare const StringLiteral: $.Parser<$$.StringLiteral>;
export declare const receiverParam: $.Parser<$$.receiverParam>;
export declare const Parameter$noSkip: $.Parser<$$.Parameter$noSkip>;
export declare const StringLiteral$noSkip: $.Parser<$$.StringLiteral$noSkip>;
export declare const receiverParam$noSkip: $.Parser<$$.receiverParam$noSkip>;
export declare const AsmData: $.Parser<$$.AsmData>;
export declare const AsmAny: $.Parser<$$.AsmAny>;
export declare const asmInstruction: $.Parser<$$.asmInstruction>;
export declare const AsmData$noSkip: $.Parser<$$.AsmData$noSkip>;
export declare const AsmAny$noSkip: $.Parser<$$.AsmAny$noSkip>;
export declare const asmInstruction$noSkip: $.Parser<$$.asmInstruction$noSkip>;
export declare const TypeOptional: $.Parser<$$.TypeOptional>;
export declare const TypeRegular: $.Parser<$$.TypeRegular>;
export declare const TypeMap: $.Parser<$$.TypeMap>;
export declare const TypeBounced: $.Parser<$$.TypeBounced>;
export declare const $type: $.Parser<$$.$type>;
export declare const ascription: $.Parser<$$.ascription>;
export declare const TypeOptional$noSkip: $.Parser<$$.TypeOptional$noSkip>;
export declare const TypeRegular$noSkip: $.Parser<$$.TypeRegular$noSkip>;
export declare const TypeMap$noSkip: $.Parser<$$.TypeMap$noSkip>;
export declare const TypeBounced$noSkip: $.Parser<$$.TypeBounced$noSkip>;
export declare const $type$noSkip: $.Parser<$$.$type$noSkip>;
export declare const ascription$noSkip: $.Parser<$$.ascription$noSkip>;
export declare const TypeId: $.Parser<$$.TypeId>;
export declare const TypeId$noSkip: $.Parser<$$.TypeId$noSkip>;
export declare const StatementLet: $.Parser<$$.StatementLet>;
export declare const StatementBlock: $.Parser<$$.StatementBlock>;
export declare const StatementReturn: $.Parser<$$.StatementReturn>;
export declare const StatementCondition: $.Parser<$$.StatementCondition>;
export declare const StatementWhile: $.Parser<$$.StatementWhile>;
export declare const StatementRepeat: $.Parser<$$.StatementRepeat>;
export declare const StatementUntil: $.Parser<$$.StatementUntil>;
export declare const StatementTry: $.Parser<$$.StatementTry>;
export declare const StatementForEach: $.Parser<$$.StatementForEach>;
export declare const StatementExpression: $.Parser<$$.StatementExpression>;
export declare const StatementAssign: $.Parser<$$.StatementAssign>;
export declare const statement: $.Parser<$$.statement>;
export declare const StatementLet$noSkip: $.Parser<$$.StatementLet$noSkip>;
export declare const StatementBlock$noSkip: $.Parser<$$.StatementBlock$noSkip>;
export declare const StatementReturn$noSkip: $.Parser<$$.StatementReturn$noSkip>;
export declare const StatementCondition$noSkip: $.Parser<$$.StatementCondition$noSkip>;
export declare const StatementWhile$noSkip: $.Parser<$$.StatementWhile$noSkip>;
export declare const StatementRepeat$noSkip: $.Parser<$$.StatementRepeat$noSkip>;
export declare const StatementUntil$noSkip: $.Parser<$$.StatementUntil$noSkip>;
export declare const StatementTry$noSkip: $.Parser<$$.StatementTry$noSkip>;
export declare const StatementForEach$noSkip: $.Parser<$$.StatementForEach$noSkip>;
export declare const StatementExpression$noSkip: $.Parser<$$.StatementExpression$noSkip>;
export declare const StatementAssign$noSkip: $.Parser<$$.StatementAssign$noSkip>;
export declare const statement$noSkip: $.Parser<$$.statement$noSkip>;
export declare const statements: $.Parser<$$.statements>;
export declare const statements$noSkip: $.Parser<$$.statements$noSkip>;
export declare const Conditional: $.Parser<$$.Conditional>;
export declare const expression: $.Parser<$$.expression>;
export declare const Conditional$noSkip: $.Parser<$$.Conditional$noSkip>;
export declare const expression$noSkip: $.Parser<$$.expression$noSkip>;
export declare const Or: $.Parser<$$.Or>;
export declare const Or$noSkip: $.Parser<$$.Or$noSkip>;
export declare const And: $.Parser<$$.And>;
export declare const And$noSkip: $.Parser<$$.And$noSkip>;
export declare const BitwiseOr: $.Parser<$$.BitwiseOr>;
export declare const BitwiseOr$noSkip: $.Parser<$$.BitwiseOr$noSkip>;
export declare const BitwiseXor: $.Parser<$$.BitwiseXor>;
export declare const BitwiseXor$noSkip: $.Parser<$$.BitwiseXor$noSkip>;
export declare const BitwiseAnd: $.Parser<$$.BitwiseAnd>;
export declare const BitwiseAnd$noSkip: $.Parser<$$.BitwiseAnd$noSkip>;
export declare const Equality: $.Parser<$$.Equality>;
export declare const Equality$noSkip: $.Parser<$$.Equality$noSkip>;
export declare const Compare: $.Parser<$$.Compare>;
export declare const Compare$noSkip: $.Parser<$$.Compare$noSkip>;
export declare const BitwiseShift: $.Parser<$$.BitwiseShift>;
export declare const BitwiseShift$noSkip: $.Parser<$$.BitwiseShift$noSkip>;
export declare const Add: $.Parser<$$.Add>;
export declare const Add$noSkip: $.Parser<$$.Add$noSkip>;
export declare const Mul: $.Parser<$$.Mul>;
export declare const Mul$noSkip: $.Parser<$$.Mul$noSkip>;
export declare const Unary: $.Parser<$$.Unary>;
export declare const Unary$noSkip: $.Parser<$$.Unary$noSkip>;
export declare const Suffix: $.Parser<$$.Suffix>;
export declare const Suffix$noSkip: $.Parser<$$.Suffix$noSkip>;
export declare const SuffixUnboxNotNull: $.Parser<$$.SuffixUnboxNotNull>;
export declare const SuffixCall: $.Parser<$$.SuffixCall>;
export declare const SuffixFieldAccess: $.Parser<$$.SuffixFieldAccess>;
export declare const suffix: $.Parser<$$.suffix>;
export declare const SuffixUnboxNotNull$noSkip: $.Parser<$$.SuffixUnboxNotNull$noSkip>;
export declare const SuffixCall$noSkip: $.Parser<$$.SuffixCall$noSkip>;
export declare const SuffixFieldAccess$noSkip: $.Parser<$$.SuffixFieldAccess$noSkip>;
export declare const suffix$noSkip: $.Parser<$$.suffix$noSkip>;
export declare const Parens: $.Parser<$$.Parens>;
export declare const StructInstance: $.Parser<$$.StructInstance>;
export declare const IntegerLiteralHex: $.Parser<$$.IntegerLiteralHex>;
export declare const IntegerLiteralBin: $.Parser<$$.IntegerLiteralBin>;
export declare const IntegerLiteralOct: $.Parser<$$.IntegerLiteralOct>;
export declare const IntegerLiteralDec: $.Parser<$$.IntegerLiteralDec>;
export declare const integerLiteral: $.Parser<$$.integerLiteral>;
export declare const BoolLiteral: $.Parser<$$.BoolLiteral>;
export declare const InitOf: $.Parser<$$.InitOf>;
export declare const $null: $.Parser<$$.$null>;
export declare const Id: $.Parser<$$.Id>;
export declare const primary: $.Parser<$$.primary>;
export declare const Parens$noSkip: $.Parser<$$.Parens$noSkip>;
export declare const StructInstance$noSkip: $.Parser<$$.StructInstance$noSkip>;
export declare const IntegerLiteralHex$noSkip: $.Parser<$$.IntegerLiteralHex$noSkip>;
export declare const IntegerLiteralBin$noSkip: $.Parser<$$.IntegerLiteralBin$noSkip>;
export declare const IntegerLiteralOct$noSkip: $.Parser<$$.IntegerLiteralOct$noSkip>;
export declare const IntegerLiteralDec$noSkip: $.Parser<$$.IntegerLiteralDec$noSkip>;
export declare const integerLiteral$noSkip: $.Parser<$$.integerLiteral$noSkip>;
export declare const BoolLiteral$noSkip: $.Parser<$$.BoolLiteral$noSkip>;
export declare const InitOf$noSkip: $.Parser<$$.InitOf$noSkip>;
export declare const $null$noSkip: $.Parser<$$.$null$noSkip>;
export declare const Id$noSkip: $.Parser<$$.Id$noSkip>;
export declare const primary$noSkip: $.Parser<$$.primary$noSkip>;
export declare const parens: $.Parser<$$.parens>;
export declare const parens$noSkip: $.Parser<$$.parens$noSkip>;
export declare const structFieldInitializer: $.Parser<$$.structFieldInitializer>;
export declare const structFieldInitializer$noSkip: $.Parser<$$.structFieldInitializer$noSkip>;
export declare const parametersFactual: $.Parser<$$.parametersFactual>;
export declare const parametersFactual$noSkip: $.Parser<$$.parametersFactual$noSkip>;
export declare const parametersFormal: $.Parser<$$.parametersFormal>;
export declare const parametersFormal$noSkip: $.Parser<$$.parametersFormal$noSkip>;
export declare const idPart: $.Parser<$$.idPart>;
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
export declare const digit: $.Parser<$$.digit>;
export declare const notDecimalNumber: $.Parser<$$.notDecimalNumber>;
export declare const hexDigit: $.Parser<$$.hexDigit>;
export declare const notHexadecimalNumber: $.Parser<$$.notHexadecimalNumber>;
export declare const funcInvalidId: $.Parser<$$.funcInvalidId>;
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
export declare const digit$noSkip: $.Parser<$$.digit$noSkip>;
export declare const notDecimalNumber$noSkip: $.Parser<$$.notDecimalNumber$noSkip>;
export declare const hexDigit$noSkip: $.Parser<$$.hexDigit$noSkip>;
export declare const notHexadecimalNumber$noSkip: $.Parser<$$.notHexadecimalNumber$noSkip>;
export declare const funcInvalidId$noSkip: $.Parser<$$.funcInvalidId$noSkip>;
export declare const whiteSpace: $.Parser<$$.whiteSpace>;
export declare const funcPlainId: $.Parser<$$.funcPlainId>;
export declare const whiteSpace$noSkip: $.Parser<$$.whiteSpace$noSkip>;
export declare const funcPlainId$noSkip: $.Parser<$$.funcPlainId$noSkip>;
export declare const funcQuotedId: $.Parser<$$.funcQuotedId>;
export declare const funcQuotedId$noSkip: $.Parser<$$.funcQuotedId$noSkip>;
export declare const funcId: $.Parser<$$.funcId>;
export declare const funcId$noSkip: $.Parser<$$.funcId$noSkip>;
export declare const escapeChar: $.Parser<$$.escapeChar>;
export declare const escapeChar$noSkip: $.Parser<$$.escapeChar$noSkip>;
export declare const fun: $.Parser<$$.fun>;
export declare const $let: $.Parser<$$.$let>;
export declare const $return: $.Parser<$$.$return>;
export declare const receive: $.Parser<$$.receive>;
export declare const extend: $.Parser<$$.extend>;
export declare const $native: $.Parser<$$.$native>;
export declare const primitive: $.Parser<$$.primitive>;
export declare const $public: $.Parser<$$.$public>;
export declare const $if: $.Parser<$$.$if>;
export declare const $else: $.Parser<$$.$else>;
export declare const $while: $.Parser<$$.$while>;
export declare const repeat: $.Parser<$$.repeat>;
export declare const $do: $.Parser<$$.$do>;
export declare const until: $.Parser<$$.until>;
export declare const $try: $.Parser<$$.$try>;
export declare const $catch: $.Parser<$$.$catch>;
export declare const foreach: $.Parser<$$.foreach>;
export declare const $as: $.Parser<$$.$as>;
export declare const map: $.Parser<$$.map>;
export declare const external: $.Parser<$$.external>;
export declare const $import: $.Parser<$$.$import>;
export declare const $with: $.Parser<$$.$with>;
export declare const trait: $.Parser<$$.trait>;
export declare const initOf: $.Parser<$$.initOf>;
export declare const $const: $.Parser<$$.$const>;
export declare const keyword: $.Parser<$$.keyword>;
export declare const reservedWord: $.Parser<$$.reservedWord>;
export declare const fun$noSkip: $.Parser<$$.fun$noSkip>;
export declare const $let$noSkip: $.Parser<$$.$let$noSkip>;
export declare const $return$noSkip: $.Parser<$$.$return$noSkip>;
export declare const receive$noSkip: $.Parser<$$.receive$noSkip>;
export declare const extend$noSkip: $.Parser<$$.extend$noSkip>;
export declare const $native$noSkip: $.Parser<$$.$native$noSkip>;
export declare const primitive$noSkip: $.Parser<$$.primitive$noSkip>;
export declare const $public$noSkip: $.Parser<$$.$public$noSkip>;
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
export declare const external$noSkip: $.Parser<$$.external$noSkip>;
export declare const $import$noSkip: $.Parser<$$.$import$noSkip>;
export declare const $with$noSkip: $.Parser<$$.$with$noSkip>;
export declare const trait$noSkip: $.Parser<$$.trait$noSkip>;
export declare const initOf$noSkip: $.Parser<$$.initOf$noSkip>;
export declare const $const$noSkip: $.Parser<$$.$const$noSkip>;
export declare const keyword$noSkip: $.Parser<$$.keyword$noSkip>;
export declare const reservedWord$noSkip: $.Parser<$$.reservedWord$noSkip>;
export declare const contract: $.Parser<$$.contract>;
export declare const contract$noSkip: $.Parser<$$.contract$noSkip>;
export declare const multiLineComment: $.Parser<$$.multiLineComment>;
export declare const singleLineComment: $.Parser<$$.singleLineComment>;
export declare const comment: $.Parser<$$.comment>;
export declare const space: $.Parser<$$.space>;
export declare const JustImports: $.Parser<$$.JustImports>;
export declare const JustImports$noSkip: $.Parser<$$.JustImports$noSkip>;
//# sourceMappingURL=grammar.d.ts.map