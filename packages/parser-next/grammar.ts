import * as $ from "@langtools/runtime";
export namespace $$ {
  export type idPart$noSkip = string | string | "_";
  export type multiLineComment$noSkip = string;
  export type singleLineComment$noSkip = string;
  export type comment$noSkip =
    | multiLineComment$noSkip
    | singleLineComment$noSkip;
  export type space$noSkip = " " | "\t" | "\r" | "\n" | comment$noSkip;
  export type $import = "import";
  export type hexDigit$noSkip = string | string;
  export type escapeChar$noSkip =
    | "\\"
    | '"'
    | "n"
    | "r"
    | "t"
    | "v"
    | "b"
    | "f"
    | string
    | string
    | string;
  export type StringLiteral = {
    readonly $: "StringLiteral";
    readonly value: string;
  };
  export type Import = {
    readonly $: "Import";
    readonly path: StringLiteral;
  };
  export type primitive = "primitive";
  export type TypeId = {
    readonly $: "TypeId";
    readonly name: string;
  };
  export type PrimitiveTypeDecl = {
    readonly $: "PrimitiveTypeDecl";
    readonly name: TypeId;
  };
  export type mutates = "mutates";
  export type $extends = "extends";
  export type virtual = "virtual";
  export type override = "override";
  export type inline = "inline";
  export type $abstract = "abstract";
  export type functionAttribute =
    | "get"
    | mutates
    | $extends
    | virtual
    | override
    | inline
    | $abstract;
  export type fun = "fun";
  export type fun$noSkip = "fun";
  export type $let$noSkip = "let";
  export type $return$noSkip = "return";
  export type receive$noSkip = "receive";
  export type extend$noSkip = "extend";
  export type $native$noSkip = "native";
  export type primitive$noSkip = "primitive";
  export type $public$noSkip = "public";
  export type $null$noSkip = "null";
  export type $if$noSkip = "if";
  export type $else$noSkip = "else";
  export type $while$noSkip = "while";
  export type repeat$noSkip = "repeat";
  export type $do$noSkip = "do";
  export type until$noSkip = "until";
  export type $try$noSkip = "try";
  export type $catch$noSkip = "catch";
  export type foreach$noSkip = "foreach";
  export type $as$noSkip = "as";
  export type map$noSkip = "map";
  export type mutates$noSkip = "mutates";
  export type $extends$noSkip = "extends";
  export type external$noSkip = "external";
  export type $import$noSkip = "import";
  export type $with$noSkip = "with";
  export type trait$noSkip = "trait";
  export type initOf$noSkip = "initOf";
  export type override$noSkip = "override";
  export type $abstract$noSkip = "abstract";
  export type virtual$noSkip = "virtual";
  export type inline$noSkip = "inline";
  export type $const$noSkip = "const";
  export type keyword$noSkip =
    | fun$noSkip
    | $let$noSkip
    | $return$noSkip
    | receive$noSkip
    | extend$noSkip
    | $native$noSkip
    | primitive$noSkip
    | $public$noSkip
    | $null$noSkip
    | $if$noSkip
    | $else$noSkip
    | $while$noSkip
    | repeat$noSkip
    | $do$noSkip
    | until$noSkip
    | $try$noSkip
    | $catch$noSkip
    | foreach$noSkip
    | $as$noSkip
    | map$noSkip
    | mutates$noSkip
    | $extends$noSkip
    | external$noSkip
    | $import$noSkip
    | $with$noSkip
    | trait$noSkip
    | initOf$noSkip
    | override$noSkip
    | $abstract$noSkip
    | virtual$noSkip
    | inline$noSkip
    | $const$noSkip;
  export type reservedWord$noSkip = keyword$noSkip;
  export type Id = {
    readonly $: "Id";
    readonly name: string;
  };
  export type inter<A, B> = {
    readonly head: A;
    readonly tail: readonly {
      readonly op: B;
      readonly right: A;
    }[];
  };
  export type TypeOptional = {
    readonly $: "TypeOptional";
    readonly child: TypeId;
  };
  export type TypeRegular = {
    readonly $: "TypeRegular";
    readonly child: TypeId;
  };
  export type map = "map";
  export type $as = "as";
  export type TypeMap = {
    readonly $: "TypeMap";
    readonly key: TypeId;
    readonly keyAs: Id | undefined;
    readonly value: TypeId;
    readonly valueAs: Id | undefined;
  };
  export type TypeBounced = {
    readonly $: "TypeBounced";
    readonly child: TypeId;
  };
  export type $type = TypeOptional | TypeRegular | TypeMap | TypeBounced;
  export type ascription = $type;
  export type Parameter = {
    readonly $: "Parameter";
    readonly name: Id;
    readonly type: ascription;
  };
  export type parametersFormal = inter<Parameter, ","> | undefined;
  export type $let = "let";
  export type hexDigit = string | string;
  export type IntegerLiteralHex = {
    readonly $: "IntegerLiteralHex";
    readonly digits: string;
  };
  export type IntegerLiteralBin = {
    readonly $: "IntegerLiteralBin";
    readonly digits: string;
  };
  export type IntegerLiteralOct = {
    readonly $: "IntegerLiteralOct";
    readonly digits: string;
  };
  export type digit = string;
  export type IntegerLiteralDec = {
    readonly $: "IntegerLiteralDec";
    readonly digits: string;
  };
  export type integerLiteral =
    | IntegerLiteralHex
    | IntegerLiteralBin
    | IntegerLiteralOct
    | IntegerLiteralDec;
  export type idPart = string | string | "_";
  export type BoolLiteral = {
    readonly $: "BoolLiteral";
    readonly value: "true" | "false";
  };
  export type initOf = "initOf";
  export type $null = "null";
  export type SuffixUnboxNotNull = {
    readonly $: "SuffixUnboxNotNull";
  };
  export type SuffixFieldAccess = {
    readonly $: "SuffixFieldAccess";
    readonly name: Id;
  };
  export type SuffixCall = {
    readonly $: "SuffixCall";
    readonly params: parametersFactual;
  };
  export type suffix = SuffixUnboxNotNull | SuffixCall | SuffixFieldAccess;
  export type parametersFactual = inter<expression, ","> | undefined;
  export type InitOf = {
    readonly $: "InitOf";
    readonly name: Id;
    readonly params: parametersFactual;
  };
  export type structFieldInitializer = {
    readonly name: Id;
    readonly init: expression | undefined;
  };
  export type StructInstance = {
    readonly $: "StructInstance";
    readonly fields: inter<structFieldInitializer, ","> | undefined;
  };
  export type parens = expression;
  export type Parens = {
    readonly $: "Parens";
  };
  export type primary =
    | Parens
    | StructInstance
    | integerLiteral
    | BoolLiteral
    | InitOf
    | $null
    | StringLiteral
    | Id;
  export type Suffix = {
    readonly $: "Suffix";
    readonly expression: primary;
    readonly suffixes: readonly suffix[];
  };
  export type Unary = {
    readonly $: "Unary";
    readonly prefixes: readonly ("-" | "+" | "!" | "~")[];
    readonly expression: Suffix;
  };
  export type Mul = {
    readonly $: "Mul";
  };
  export type Add = {
    readonly $: "Add";
  };
  export type BitwiseShift = {
    readonly $: "BitwiseShift";
  };
  export type Compare = {
    readonly $: "Compare";
  };
  export type Equality = {
    readonly $: "Equality";
  };
  export type BitwiseAnd = {
    readonly $: "BitwiseAnd";
  };
  export type BitwiseXor = {
    readonly $: "BitwiseXor";
  };
  export type BitwiseOr = {
    readonly $: "BitwiseOr";
  };
  export type And = {
    readonly $: "And";
  };
  export type Or = {
    readonly $: "Or";
  };
  export type Conditional = {
    readonly $: "Conditional";
    readonly head: Or;
    readonly tail: readonly {
      readonly thenBranch: Or;
      readonly elseBranch: Conditional;
    }[];
  };
  export type expression = Conditional;
  export type StatementLet = {
    readonly $: "StatementLet";
    readonly name: Id;
    readonly type: ascription | undefined;
    readonly init: expression;
  };
  export type $return = "return";
  export type StatementReturn = {
    readonly $: "StatementReturn";
    readonly expression: expression | undefined;
  };
  export type $if = "if";
  export type $else = "else";
  export type $while = "while";
  export type repeat = "repeat";
  export type $do = "do";
  export type until = "until";
  export type $try = "try";
  export type $catch = "catch";
  export type foreach = "foreach";
  export type StatementExpression = {
    readonly $: "StatementExpression";
    readonly expression: expression;
  };
  export type StatementAssign = {
    readonly $: "StatementAssign";
    readonly left: expression;
    readonly operator:
      | "-"
      | "+"
      | "*"
      | "/"
      | "%"
      | "|"
      | "&"
      | "^"
      | undefined;
    readonly right: expression;
  };
  export type StatementForEach = {
    readonly $: "StatementForEach";
    readonly key: Id;
    readonly value: Id;
    readonly expression: expression;
    readonly body: statements;
  };
  export type StatementTry = {
    readonly $: "StatementTry";
    readonly body: statements;
    readonly handler:
      | {
          readonly name: Id;
          readonly body2: statements;
        }
      | undefined;
  };
  export type StatementUntil = {
    readonly $: "StatementUntil";
    readonly body: statements;
    readonly condition: parens;
  };
  export type StatementRepeat = {
    readonly $: "StatementRepeat";
    readonly condition: parens;
    readonly body: statements;
  };
  export type StatementWhile = {
    readonly $: "StatementWhile";
    readonly condition: parens;
    readonly body: statements;
  };
  export type StatementCondition = {
    readonly $: "StatementCondition";
    readonly condition: expression;
    readonly trueBranch: statements;
    readonly falseBranch: statements | StatementCondition | undefined;
  };
  export type StatementBlock = {
    readonly $: "StatementBlock";
    readonly body: statements;
  };
  export type statement =
    | StatementLet
    | StatementBlock
    | StatementReturn
    | StatementCondition
    | StatementWhile
    | StatementRepeat
    | StatementUntil
    | StatementTry
    | StatementForEach
    | StatementExpression
    | StatementAssign;
  export type statements = readonly statement[];
  export type FunctionDefinition = {
    readonly $: "FunctionDefinition";
    readonly body: statements;
  };
  export type FunctionDeclaration = {
    readonly $: "FunctionDeclaration";
  };
  export type Function = {
    readonly $: "Function";
    readonly attributes: readonly functionAttribute[];
    readonly name: Id;
    readonly parameters: parametersFormal;
    readonly type: ascription | undefined;
    readonly body: FunctionDefinition | FunctionDeclaration;
  };
  export type AsmData = {
    readonly $: "AsmData";
  };
  export type multiLineComment = string;
  export type singleLineComment = string;
  export type comment = multiLineComment | singleLineComment;
  export type space = " " | "\t" | "\r" | "\n" | comment;
  export type AsmAny = {
    readonly $: "AsmAny";
  };
  export type asmInstruction = AsmData | AsmAny;
  export type AsmFunction = {
    readonly $: "AsmFunction";
    readonly shuffle:
      | {
          readonly ids: readonly Id[];
          readonly to: readonly IntegerLiteralDec[] | undefined;
        }
      | undefined;
    readonly attributes: readonly functionAttribute[];
    readonly name: Id;
    readonly parameters: parametersFormal;
    readonly returnType: ascription | undefined;
    readonly instructions: readonly asmInstruction[];
  };
  export type funcQuotedId = string;
  export type notUnderscore = "_";
  export type notArithOperator =
    | "+"
    | "-"
    | "*"
    | "/%"
    | "/"
    | "%"
    | "~/"
    | "^/"
    | "~%"
    | "^%";
  export type notComparisonOperator =
    | "<=>"
    | "<="
    | "<"
    | ">="
    | ">"
    | "!="
    | "==";
  export type notBitwiseOperator =
    | "~>>"
    | "~"
    | "^>>"
    | "^"
    | "&"
    | "|"
    | "<<"
    | ">>";
  export type notAssignOperator =
    | "="
    | "+="
    | "-="
    | "*="
    | "/="
    | "%="
    | "~>>="
    | "~/="
    | "~%="
    | "^>>="
    | "^/="
    | "^%="
    | "^="
    | "<<="
    | ">>="
    | "&="
    | "|=";
  export type notDelimiter = "[" | "]" | "{" | "}" | "?" | ":";
  export type notControlKeyword =
    | "return"
    | "var"
    | "repeat"
    | "do"
    | "while"
    | "until"
    | "try"
    | "catch"
    | "ifnot"
    | "if"
    | "then"
    | "elseifnot"
    | "elseif"
    | "else";
  export type notTypeKeyword =
    | "int"
    | "cell"
    | "builder"
    | "slice"
    | "cont"
    | "tuple"
    | "type"
    | "->"
    | "forall";
  export type notKeyword =
    | "extern"
    | "global"
    | "asm"
    | "impure"
    | "inline_ref"
    | "inline"
    | "auto_apply"
    | "method_id"
    | "operator"
    | "infixl"
    | "infixr"
    | "infix"
    | "const";
  export type notDirective = "#include" | "#pragma";
  export type notDecimalNumber = string;
  export type notHexadecimalNumber = string;
  export type funcInvalidId =
    | notUnderscore
    | notArithOperator
    | notComparisonOperator
    | notBitwiseOperator
    | notAssignOperator
    | notDelimiter
    | notControlKeyword
    | notTypeKeyword
    | notKeyword
    | notDirective
    | notDecimalNumber
    | notHexadecimalNumber;
  export type whiteSpace = " " | "\t" | "\r" | "\n";
  export type funcPlainId = string;
  export type funcId = {
    readonly accessor: "." | "~" | undefined;
    readonly id: funcQuotedId | funcPlainId;
  };
  export type $native = "native";
  export type NativeFunctionDecl = {
    readonly $: "NativeFunctionDecl";
    readonly nativeName: funcId;
    readonly attributes: readonly functionAttribute[];
    readonly name: Id;
    readonly parameters: parametersFormal;
    readonly returnType: ascription | undefined;
  };
  export type $const = "const";
  export type ConstantDefinition = {
    readonly $: "ConstantDefinition";
    readonly expression: expression;
  };
  export type ConstantDeclaration = {
    readonly $: "ConstantDeclaration";
  };
  export type Constant = {
    readonly $: "Constant";
    readonly attributes: readonly (virtual | override | $abstract)[];
    readonly name: Id;
    readonly type: ascription;
    readonly body: ConstantDefinition | ConstantDeclaration;
  };
  export type FieldDecl = {
    readonly $: "FieldDecl";
    readonly name: Id;
    readonly type: ascription;
    readonly as: Id | undefined;
    readonly expression: expression | undefined;
  };
  export type structFields = inter<FieldDecl, ";"> | undefined;
  export type StructDecl = {
    readonly $: "StructDecl";
    readonly name: TypeId;
    readonly fields: structFields;
  };
  export type MessageDecl = {
    readonly $: "MessageDecl";
    readonly id: integerLiteral | undefined;
    readonly name: TypeId;
    readonly fields: structFields;
  };
  export type ContractAttribute = {
    readonly $: "ContractAttribute";
  };
  export type contract = "contract";
  export type $with = "with";
  export type InheritedTraits = {
    readonly $: "InheritedTraits";
    readonly ids: inter<Id, ",">;
  };
  export type ContractInit = {
    readonly $: "ContractInit";
  };
  export type receive = "receive";
  export type receiverParam = Parameter | StringLiteral | undefined;
  export type ReceiverReceive = {
    readonly $: "ReceiverReceive";
    readonly param: receiverParam;
    readonly body: statements;
  };
  export type external = "external";
  export type ReceiverExternal = {
    readonly $: "ReceiverExternal";
    readonly param: receiverParam;
    readonly body: statements;
  };
  export type ReceiverBounced = {
    readonly $: "ReceiverBounced";
    readonly param: Parameter;
    readonly body: statements;
  };
  export type receiver = ReceiverReceive | ReceiverExternal | ReceiverBounced;
  export type storageVar = FieldDecl;
  export type contractItemDecl =
    | ContractInit
    | receiver
    | Function
    | Constant
    | storageVar;
  export type Contract = {
    readonly $: "Contract";
    readonly attributes: readonly ContractAttribute[];
    readonly name: Id;
    readonly traits: InheritedTraits | undefined;
    readonly items: readonly contractItemDecl[];
  };
  export type trait = "trait";
  export type traitItemDecl = receiver | Function | Constant | storageVar;
  export type Trait = {
    readonly $: "Trait";
  };
  export type moduleItem =
    | PrimitiveTypeDecl
    | Function
    | AsmFunction
    | NativeFunctionDecl
    | Constant
    | StructDecl
    | MessageDecl
    | Contract
    | Trait;
  export type Module = {
    readonly $: "Module";
    readonly imports: readonly Import[];
    readonly items: readonly moduleItem[];
  };
  export type StringLiteral$noSkip = {
    readonly $: "StringLiteral";
    readonly value: string;
  };
  export type Import$noSkip = {
    readonly $: "Import";
    readonly path: StringLiteral$noSkip;
  };
  export type TypeId$noSkip = {
    readonly $: "TypeId";
    readonly name: string;
  };
  export type PrimitiveTypeDecl$noSkip = {
    readonly $: "PrimitiveTypeDecl";
    readonly name: TypeId$noSkip;
  };
  export type functionAttribute$noSkip =
    | "get"
    | mutates$noSkip
    | $extends$noSkip
    | virtual$noSkip
    | override$noSkip
    | inline$noSkip
    | $abstract$noSkip;
  export type Id$noSkip = {
    readonly $: "Id";
    readonly name: string;
  };
  export type inter$noSkip<A, B> = {
    readonly head: A;
    readonly tail: readonly {
      readonly op: B;
      readonly right: A;
    }[];
  };
  export type TypeOptional$noSkip = {
    readonly $: "TypeOptional";
    readonly child: TypeId$noSkip;
  };
  export type TypeRegular$noSkip = {
    readonly $: "TypeRegular";
    readonly child: TypeId$noSkip;
  };
  export type TypeMap$noSkip = {
    readonly $: "TypeMap";
    readonly key: TypeId$noSkip;
    readonly keyAs: Id$noSkip | undefined;
    readonly value: TypeId$noSkip;
    readonly valueAs: Id$noSkip | undefined;
  };
  export type TypeBounced$noSkip = {
    readonly $: "TypeBounced";
    readonly child: TypeId$noSkip;
  };
  export type $type$noSkip =
    | TypeOptional$noSkip
    | TypeRegular$noSkip
    | TypeMap$noSkip
    | TypeBounced$noSkip;
  export type ascription$noSkip = $type$noSkip;
  export type Parameter$noSkip = {
    readonly $: "Parameter";
    readonly name: Id$noSkip;
    readonly type: ascription$noSkip;
  };
  export type parametersFormal$noSkip =
    | inter$noSkip<Parameter$noSkip, ",">
    | undefined;
  export type IntegerLiteralHex$noSkip = {
    readonly $: "IntegerLiteralHex";
    readonly digits: string;
  };
  export type IntegerLiteralBin$noSkip = {
    readonly $: "IntegerLiteralBin";
    readonly digits: string;
  };
  export type IntegerLiteralOct$noSkip = {
    readonly $: "IntegerLiteralOct";
    readonly digits: string;
  };
  export type digit$noSkip = string;
  export type IntegerLiteralDec$noSkip = {
    readonly $: "IntegerLiteralDec";
    readonly digits: string;
  };
  export type integerLiteral$noSkip =
    | IntegerLiteralHex$noSkip
    | IntegerLiteralBin$noSkip
    | IntegerLiteralOct$noSkip
    | IntegerLiteralDec$noSkip;
  export type BoolLiteral$noSkip = {
    readonly $: "BoolLiteral";
    readonly value: "true" | "false";
  };
  export type SuffixUnboxNotNull$noSkip = {
    readonly $: "SuffixUnboxNotNull";
  };
  export type SuffixFieldAccess$noSkip = {
    readonly $: "SuffixFieldAccess";
    readonly name: Id$noSkip;
  };
  export type SuffixCall$noSkip = {
    readonly $: "SuffixCall";
    readonly params: parametersFactual$noSkip;
  };
  export type suffix$noSkip =
    | SuffixUnboxNotNull$noSkip
    | SuffixCall$noSkip
    | SuffixFieldAccess$noSkip;
  export type parametersFactual$noSkip =
    | inter$noSkip<expression$noSkip, ",">
    | undefined;
  export type InitOf$noSkip = {
    readonly $: "InitOf";
    readonly name: Id$noSkip;
    readonly params: parametersFactual$noSkip;
  };
  export type structFieldInitializer$noSkip = {
    readonly name: Id$noSkip;
    readonly init: expression$noSkip | undefined;
  };
  export type StructInstance$noSkip = {
    readonly $: "StructInstance";
    readonly fields:
      | inter$noSkip<structFieldInitializer$noSkip, ",">
      | undefined;
  };
  export type parens$noSkip = expression$noSkip;
  export type Parens$noSkip = {
    readonly $: "Parens";
  };
  export type primary$noSkip =
    | Parens$noSkip
    | StructInstance$noSkip
    | integerLiteral$noSkip
    | BoolLiteral$noSkip
    | InitOf$noSkip
    | $null$noSkip
    | StringLiteral$noSkip
    | Id$noSkip;
  export type Suffix$noSkip = {
    readonly $: "Suffix";
    readonly expression: primary$noSkip;
    readonly suffixes: readonly suffix$noSkip[];
  };
  export type Unary$noSkip = {
    readonly $: "Unary";
    readonly prefixes: readonly ("-" | "+" | "!" | "~")[];
    readonly expression: Suffix$noSkip;
  };
  export type Mul$noSkip = {
    readonly $: "Mul";
  };
  export type Add$noSkip = {
    readonly $: "Add";
  };
  export type BitwiseShift$noSkip = {
    readonly $: "BitwiseShift";
  };
  export type Compare$noSkip = {
    readonly $: "Compare";
  };
  export type Equality$noSkip = {
    readonly $: "Equality";
  };
  export type BitwiseAnd$noSkip = {
    readonly $: "BitwiseAnd";
  };
  export type BitwiseXor$noSkip = {
    readonly $: "BitwiseXor";
  };
  export type BitwiseOr$noSkip = {
    readonly $: "BitwiseOr";
  };
  export type And$noSkip = {
    readonly $: "And";
  };
  export type Or$noSkip = {
    readonly $: "Or";
  };
  export type Conditional$noSkip = {
    readonly $: "Conditional";
    readonly head: Or$noSkip;
    readonly tail: readonly {
      readonly thenBranch: Or$noSkip;
      readonly elseBranch: Conditional$noSkip;
    }[];
  };
  export type expression$noSkip = Conditional$noSkip;
  export type StatementLet$noSkip = {
    readonly $: "StatementLet";
    readonly name: Id$noSkip;
    readonly type: ascription$noSkip | undefined;
    readonly init: expression$noSkip;
  };
  export type StatementReturn$noSkip = {
    readonly $: "StatementReturn";
    readonly expression: expression$noSkip | undefined;
  };
  export type StatementExpression$noSkip = {
    readonly $: "StatementExpression";
    readonly expression: expression$noSkip;
  };
  export type StatementAssign$noSkip = {
    readonly $: "StatementAssign";
    readonly left: expression$noSkip;
    readonly operator:
      | "-"
      | "+"
      | "*"
      | "/"
      | "%"
      | "|"
      | "&"
      | "^"
      | undefined;
    readonly right: expression$noSkip;
  };
  export type StatementForEach$noSkip = {
    readonly $: "StatementForEach";
    readonly key: Id$noSkip;
    readonly value: Id$noSkip;
    readonly expression: expression$noSkip;
    readonly body: statements$noSkip;
  };
  export type StatementTry$noSkip = {
    readonly $: "StatementTry";
    readonly body: statements$noSkip;
    readonly handler:
      | {
          readonly name: Id$noSkip;
          readonly body2: statements$noSkip;
        }
      | undefined;
  };
  export type StatementUntil$noSkip = {
    readonly $: "StatementUntil";
    readonly body: statements$noSkip;
    readonly condition: parens$noSkip;
  };
  export type StatementRepeat$noSkip = {
    readonly $: "StatementRepeat";
    readonly condition: parens$noSkip;
    readonly body: statements$noSkip;
  };
  export type StatementWhile$noSkip = {
    readonly $: "StatementWhile";
    readonly condition: parens$noSkip;
    readonly body: statements$noSkip;
  };
  export type StatementCondition$noSkip = {
    readonly $: "StatementCondition";
    readonly condition: expression$noSkip;
    readonly trueBranch: statements$noSkip;
    readonly falseBranch:
      | statements$noSkip
      | StatementCondition$noSkip
      | undefined;
  };
  export type StatementBlock$noSkip = {
    readonly $: "StatementBlock";
    readonly body: statements$noSkip;
  };
  export type statement$noSkip =
    | StatementLet$noSkip
    | StatementBlock$noSkip
    | StatementReturn$noSkip
    | StatementCondition$noSkip
    | StatementWhile$noSkip
    | StatementRepeat$noSkip
    | StatementUntil$noSkip
    | StatementTry$noSkip
    | StatementForEach$noSkip
    | StatementExpression$noSkip
    | StatementAssign$noSkip;
  export type statements$noSkip = readonly statement$noSkip[];
  export type FunctionDefinition$noSkip = {
    readonly $: "FunctionDefinition";
    readonly body: statements$noSkip;
  };
  export type FunctionDeclaration$noSkip = {
    readonly $: "FunctionDeclaration";
  };
  export type Function$noSkip = {
    readonly $: "Function";
    readonly attributes: readonly functionAttribute$noSkip[];
    readonly name: Id$noSkip;
    readonly parameters: parametersFormal$noSkip;
    readonly type: ascription$noSkip | undefined;
    readonly body: FunctionDefinition$noSkip | FunctionDeclaration$noSkip;
  };
  export type AsmData$noSkip = {
    readonly $: "AsmData";
  };
  export type AsmAny$noSkip = {
    readonly $: "AsmAny";
  };
  export type asmInstruction$noSkip = AsmData$noSkip | AsmAny$noSkip;
  export type AsmFunction$noSkip = {
    readonly $: "AsmFunction";
    readonly shuffle:
      | {
          readonly ids: readonly Id$noSkip[];
          readonly to: readonly IntegerLiteralDec$noSkip[] | undefined;
        }
      | undefined;
    readonly attributes: readonly functionAttribute$noSkip[];
    readonly name: Id$noSkip;
    readonly parameters: parametersFormal$noSkip;
    readonly returnType: ascription$noSkip | undefined;
    readonly instructions: readonly asmInstruction$noSkip[];
  };
  export type funcQuotedId$noSkip = string;
  export type notUnderscore$noSkip = "_";
  export type notArithOperator$noSkip =
    | "+"
    | "-"
    | "*"
    | "/%"
    | "/"
    | "%"
    | "~/"
    | "^/"
    | "~%"
    | "^%";
  export type notComparisonOperator$noSkip =
    | "<=>"
    | "<="
    | "<"
    | ">="
    | ">"
    | "!="
    | "==";
  export type notBitwiseOperator$noSkip =
    | "~>>"
    | "~"
    | "^>>"
    | "^"
    | "&"
    | "|"
    | "<<"
    | ">>";
  export type notAssignOperator$noSkip =
    | "="
    | "+="
    | "-="
    | "*="
    | "/="
    | "%="
    | "~>>="
    | "~/="
    | "~%="
    | "^>>="
    | "^/="
    | "^%="
    | "^="
    | "<<="
    | ">>="
    | "&="
    | "|=";
  export type notDelimiter$noSkip = "[" | "]" | "{" | "}" | "?" | ":";
  export type notControlKeyword$noSkip =
    | "return"
    | "var"
    | "repeat"
    | "do"
    | "while"
    | "until"
    | "try"
    | "catch"
    | "ifnot"
    | "if"
    | "then"
    | "elseifnot"
    | "elseif"
    | "else";
  export type notTypeKeyword$noSkip =
    | "int"
    | "cell"
    | "builder"
    | "slice"
    | "cont"
    | "tuple"
    | "type"
    | "->"
    | "forall";
  export type notKeyword$noSkip =
    | "extern"
    | "global"
    | "asm"
    | "impure"
    | "inline_ref"
    | "inline"
    | "auto_apply"
    | "method_id"
    | "operator"
    | "infixl"
    | "infixr"
    | "infix"
    | "const";
  export type notDirective$noSkip = "#include" | "#pragma";
  export type notDecimalNumber$noSkip = string;
  export type notHexadecimalNumber$noSkip = string;
  export type funcInvalidId$noSkip =
    | notUnderscore$noSkip
    | notArithOperator$noSkip
    | notComparisonOperator$noSkip
    | notBitwiseOperator$noSkip
    | notAssignOperator$noSkip
    | notDelimiter$noSkip
    | notControlKeyword$noSkip
    | notTypeKeyword$noSkip
    | notKeyword$noSkip
    | notDirective$noSkip
    | notDecimalNumber$noSkip
    | notHexadecimalNumber$noSkip;
  export type whiteSpace$noSkip = " " | "\t" | "\r" | "\n";
  export type funcPlainId$noSkip = string;
  export type funcId$noSkip = {
    readonly accessor: "." | "~" | undefined;
    readonly id: funcQuotedId$noSkip | funcPlainId$noSkip;
  };
  export type NativeFunctionDecl$noSkip = {
    readonly $: "NativeFunctionDecl";
    readonly nativeName: funcId$noSkip;
    readonly attributes: readonly functionAttribute$noSkip[];
    readonly name: Id$noSkip;
    readonly parameters: parametersFormal$noSkip;
    readonly returnType: ascription$noSkip | undefined;
  };
  export type ConstantDefinition$noSkip = {
    readonly $: "ConstantDefinition";
    readonly expression: expression$noSkip;
  };
  export type ConstantDeclaration$noSkip = {
    readonly $: "ConstantDeclaration";
  };
  export type Constant$noSkip = {
    readonly $: "Constant";
    readonly attributes: readonly (
      | virtual$noSkip
      | override$noSkip
      | $abstract$noSkip
    )[];
    readonly name: Id$noSkip;
    readonly type: ascription$noSkip;
    readonly body: ConstantDefinition$noSkip | ConstantDeclaration$noSkip;
  };
  export type FieldDecl$noSkip = {
    readonly $: "FieldDecl";
    readonly name: Id$noSkip;
    readonly type: ascription$noSkip;
    readonly as: Id$noSkip | undefined;
    readonly expression: expression$noSkip | undefined;
  };
  export type structFields$noSkip =
    | inter$noSkip<FieldDecl$noSkip, ";">
    | undefined;
  export type StructDecl$noSkip = {
    readonly $: "StructDecl";
    readonly name: TypeId$noSkip;
    readonly fields: structFields$noSkip;
  };
  export type MessageDecl$noSkip = {
    readonly $: "MessageDecl";
    readonly id: integerLiteral$noSkip | undefined;
    readonly name: TypeId$noSkip;
    readonly fields: structFields$noSkip;
  };
  export type ContractAttribute$noSkip = {
    readonly $: "ContractAttribute";
  };
  export type contract$noSkip = "contract";
  export type InheritedTraits$noSkip = {
    readonly $: "InheritedTraits";
    readonly ids: inter$noSkip<Id$noSkip, ",">;
  };
  export type ContractInit$noSkip = {
    readonly $: "ContractInit";
  };
  export type receiverParam$noSkip =
    | Parameter$noSkip
    | StringLiteral$noSkip
    | undefined;
  export type ReceiverReceive$noSkip = {
    readonly $: "ReceiverReceive";
    readonly param: receiverParam$noSkip;
    readonly body: statements$noSkip;
  };
  export type ReceiverExternal$noSkip = {
    readonly $: "ReceiverExternal";
    readonly param: receiverParam$noSkip;
    readonly body: statements$noSkip;
  };
  export type ReceiverBounced$noSkip = {
    readonly $: "ReceiverBounced";
    readonly param: Parameter$noSkip;
    readonly body: statements$noSkip;
  };
  export type receiver$noSkip =
    | ReceiverReceive$noSkip
    | ReceiverExternal$noSkip
    | ReceiverBounced$noSkip;
  export type storageVar$noSkip = FieldDecl$noSkip;
  export type contractItemDecl$noSkip =
    | ContractInit$noSkip
    | receiver$noSkip
    | Function$noSkip
    | Constant$noSkip
    | storageVar$noSkip;
  export type Contract$noSkip = {
    readonly $: "Contract";
    readonly attributes: readonly ContractAttribute$noSkip[];
    readonly name: Id$noSkip;
    readonly traits: InheritedTraits$noSkip | undefined;
    readonly items: readonly contractItemDecl$noSkip[];
  };
  export type traitItemDecl$noSkip =
    | receiver$noSkip
    | Function$noSkip
    | Constant$noSkip
    | storageVar$noSkip;
  export type Trait$noSkip = {
    readonly $: "Trait";
  };
  export type moduleItem$noSkip =
    | PrimitiveTypeDecl$noSkip
    | Function$noSkip
    | AsmFunction$noSkip
    | NativeFunctionDecl$noSkip
    | Constant$noSkip
    | StructDecl$noSkip
    | MessageDecl$noSkip
    | Contract$noSkip
    | Trait$noSkip;
  export type Module$noSkip = {
    readonly $: "Module";
    readonly imports: readonly Import$noSkip[];
    readonly items: readonly moduleItem$noSkip[];
  };
  export type escapeChar =
    | "\\"
    | '"'
    | "n"
    | "r"
    | "t"
    | "v"
    | "b"
    | "f"
    | string
    | string
    | string;
  export type extend = "extend";
  export type $public = "public";
  export type keyword =
    | fun
    | $let
    | $return
    | receive
    | extend
    | $native
    | primitive
    | $public
    | $null
    | $if
    | $else
    | $while
    | repeat
    | $do
    | until
    | $try
    | $catch
    | foreach
    | $as
    | map
    | mutates
    | $extends
    | external
    | $import
    | $with
    | trait
    | initOf
    | override
    | $abstract
    | virtual
    | inline
    | $const;
  export type reservedWord = keyword;
  export type JustImports = {
    readonly $: "JustImports";
    readonly imports: readonly Import[];
  };
  export type JustImports$noSkip = {
    readonly $: "JustImports";
    readonly imports: readonly Import$noSkip[];
  };
}
export const idPart$noSkip: $.Parser<$$.idPart$noSkip> = $.regex<
  string | string | "_"
>("a-z0-9_", true);
export const multiLineComment$noSkip: $.Parser<$$.multiLineComment$noSkip> =
  $.right(
    $.str("/*"),
    $.left(
      $.stry($.star($.right($.lookNeg($.str("*/")), $.right($.any, $.eps)))),
      $.str("*/"),
    ),
  );
export const singleLineComment$noSkip: $.Parser<$$.singleLineComment$noSkip> =
  $.right($.str("//"), $.stry($.star($.regex<"\r" | "\n">("^\\r\\n", false))));
export const comment$noSkip: $.Parser<$$.comment$noSkip> = $.alt(
  multiLineComment$noSkip,
  singleLineComment$noSkip,
);
export const space$noSkip: $.Parser<$$.space$noSkip> = $.alt(
  $.regex<" " | "\t" | "\r" | "\n">(" \\t\\r\\n", false),
  comment$noSkip,
);
export const $import: $.Parser<$$.$import> = $.left(
  $.left($.str("import"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const hexDigit$noSkip: $.Parser<$$.hexDigit$noSkip> = $.regex<
  string | string
>("0-9a-f", true);
export const escapeChar$noSkip: $.Parser<$$.escapeChar$noSkip> = $.alt(
  $.regex<"\\" | '"' | "n" | "r" | "t" | "v" | "b" | "f">('\\\\"nrtvbf', false),
  $.alt(
    $.right(
      $.str("u{"),
      $.left(
        $.stry(
          $.right(
            hexDigit$noSkip,
            $.right(
              $.opt(hexDigit$noSkip),
              $.right(
                $.opt(hexDigit$noSkip),
                $.right(
                  $.opt(hexDigit$noSkip),
                  $.right(
                    $.opt(hexDigit$noSkip),
                    $.right($.opt(hexDigit$noSkip), $.eps),
                  ),
                ),
              ),
            ),
          ),
        ),
        $.str("}"),
      ),
    ),
    $.alt(
      $.right(
        $.str("u"),
        $.stry(
          $.right(
            hexDigit$noSkip,
            $.right(
              hexDigit$noSkip,
              $.right(hexDigit$noSkip, $.right(hexDigit$noSkip, $.eps)),
            ),
          ),
        ),
      ),
      $.right(
        $.str("x"),
        $.stry($.right(hexDigit$noSkip, $.right(hexDigit$noSkip, $.eps))),
      ),
    ),
  ),
);
export const StringLiteral: $.Parser<$$.StringLiteral> = $.field(
  $.pure("StringLiteral"),
  "$",
  $.field(
    $.left(
      $.stry(
        $.right(
          $.str('"'),
          $.right(
            $.star(
              $.alt(
                $.regex<'"' | "\\">('^"\\\\', false),
                $.right($.str("\\"), escapeChar$noSkip),
              ),
            ),
            $.right($.str('"'), $.eps),
          ),
        ),
      ),
      $.star(space$noSkip),
    ),
    "value",
    $.eps,
  ),
);
export const Import: $.Parser<$$.Import> = $.field(
  $.pure("Import"),
  "$",
  $.right(
    $import,
    $.field(
      StringLiteral,
      "path",
      $.right($.left($.str(";"), $.star(space$noSkip)), $.eps),
    ),
  ),
);
export const primitive: $.Parser<$$.primitive> = $.left(
  $.left($.str("primitive"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const TypeId: $.Parser<$$.TypeId> = $.field(
  $.pure("TypeId"),
  "$",
  $.field(
    $.left(
      $.stry(
        $.right(
          $.regex<string>("A-Z", false),
          $.right(
            $.star($.regex<string | string | "_">("a-z0-9_", true)),
            $.eps,
          ),
        ),
      ),
      $.star(space$noSkip),
    ),
    "name",
    $.eps,
  ),
);
export const PrimitiveTypeDecl: $.Parser<$$.PrimitiveTypeDecl> = $.field(
  $.pure("PrimitiveTypeDecl"),
  "$",
  $.right(
    primitive,
    $.field(
      TypeId,
      "name",
      $.right($.left($.str(";"), $.star(space$noSkip)), $.eps),
    ),
  ),
);
export const mutates: $.Parser<$$.mutates> = $.left(
  $.left($.str("mutates"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $extends: $.Parser<$$.$extends> = $.left(
  $.left($.str("extends"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const virtual: $.Parser<$$.virtual> = $.left(
  $.left($.str("virtual"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const override: $.Parser<$$.override> = $.left(
  $.left($.str("override"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const inline: $.Parser<$$.inline> = $.left(
  $.left($.str("inline"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $abstract: $.Parser<$$.$abstract> = $.left(
  $.left($.str("abstract"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const functionAttribute: $.Parser<$$.functionAttribute> = $.alt(
  $.left($.str("get"), $.star(space$noSkip)),
  $.alt(
    mutates,
    $.alt($extends, $.alt(virtual, $.alt(override, $.alt(inline, $abstract)))),
  ),
);
export const fun: $.Parser<$$.fun> = $.left(
  $.left($.str("fun"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const fun$noSkip: $.Parser<$$.fun$noSkip> = $.left(
  $.str("fun"),
  $.lookNeg(idPart$noSkip),
);
export const $let$noSkip: $.Parser<$$.$let$noSkip> = $.left(
  $.str("let"),
  $.lookNeg(idPart$noSkip),
);
export const $return$noSkip: $.Parser<$$.$return$noSkip> = $.left(
  $.str("return"),
  $.lookNeg(idPart$noSkip),
);
export const receive$noSkip: $.Parser<$$.receive$noSkip> = $.left(
  $.str("receive"),
  $.lookNeg(idPart$noSkip),
);
export const extend$noSkip: $.Parser<$$.extend$noSkip> = $.left(
  $.str("extend"),
  $.lookNeg(idPart$noSkip),
);
export const $native$noSkip: $.Parser<$$.$native$noSkip> = $.left(
  $.str("native"),
  $.lookNeg(idPart$noSkip),
);
export const primitive$noSkip: $.Parser<$$.primitive$noSkip> = $.left(
  $.str("primitive"),
  $.lookNeg(idPart$noSkip),
);
export const $public$noSkip: $.Parser<$$.$public$noSkip> = $.left(
  $.str("public"),
  $.lookNeg(idPart$noSkip),
);
export const $null$noSkip: $.Parser<$$.$null$noSkip> = $.left(
  $.str("null"),
  $.lookNeg(idPart$noSkip),
);
export const $if$noSkip: $.Parser<$$.$if$noSkip> = $.left(
  $.str("if"),
  $.lookNeg(idPart$noSkip),
);
export const $else$noSkip: $.Parser<$$.$else$noSkip> = $.left(
  $.str("else"),
  $.lookNeg(idPart$noSkip),
);
export const $while$noSkip: $.Parser<$$.$while$noSkip> = $.left(
  $.str("while"),
  $.lookNeg(idPart$noSkip),
);
export const repeat$noSkip: $.Parser<$$.repeat$noSkip> = $.left(
  $.str("repeat"),
  $.lookNeg(idPart$noSkip),
);
export const $do$noSkip: $.Parser<$$.$do$noSkip> = $.left(
  $.str("do"),
  $.lookNeg(idPart$noSkip),
);
export const until$noSkip: $.Parser<$$.until$noSkip> = $.left(
  $.str("until"),
  $.lookNeg(idPart$noSkip),
);
export const $try$noSkip: $.Parser<$$.$try$noSkip> = $.left(
  $.str("try"),
  $.lookNeg(idPart$noSkip),
);
export const $catch$noSkip: $.Parser<$$.$catch$noSkip> = $.left(
  $.str("catch"),
  $.lookNeg(idPart$noSkip),
);
export const foreach$noSkip: $.Parser<$$.foreach$noSkip> = $.left(
  $.str("foreach"),
  $.lookNeg(idPart$noSkip),
);
export const $as$noSkip: $.Parser<$$.$as$noSkip> = $.left(
  $.str("as"),
  $.lookNeg(idPart$noSkip),
);
export const map$noSkip: $.Parser<$$.map$noSkip> = $.left(
  $.str("map"),
  $.lookNeg(idPart$noSkip),
);
export const mutates$noSkip: $.Parser<$$.mutates$noSkip> = $.left(
  $.str("mutates"),
  $.lookNeg(idPart$noSkip),
);
export const $extends$noSkip: $.Parser<$$.$extends$noSkip> = $.left(
  $.str("extends"),
  $.lookNeg(idPart$noSkip),
);
export const external$noSkip: $.Parser<$$.external$noSkip> = $.left(
  $.str("external"),
  $.lookNeg(idPart$noSkip),
);
export const $import$noSkip: $.Parser<$$.$import$noSkip> = $.left(
  $.str("import"),
  $.lookNeg(idPart$noSkip),
);
export const $with$noSkip: $.Parser<$$.$with$noSkip> = $.left(
  $.str("with"),
  $.lookNeg(idPart$noSkip),
);
export const trait$noSkip: $.Parser<$$.trait$noSkip> = $.left(
  $.str("trait"),
  $.lookNeg(idPart$noSkip),
);
export const initOf$noSkip: $.Parser<$$.initOf$noSkip> = $.left(
  $.str("initOf"),
  $.lookNeg(idPart$noSkip),
);
export const override$noSkip: $.Parser<$$.override$noSkip> = $.left(
  $.str("override"),
  $.lookNeg(idPart$noSkip),
);
export const $abstract$noSkip: $.Parser<$$.$abstract$noSkip> = $.left(
  $.str("abstract"),
  $.lookNeg(idPart$noSkip),
);
export const virtual$noSkip: $.Parser<$$.virtual$noSkip> = $.left(
  $.str("virtual"),
  $.lookNeg(idPart$noSkip),
);
export const inline$noSkip: $.Parser<$$.inline$noSkip> = $.left(
  $.str("inline"),
  $.lookNeg(idPart$noSkip),
);
export const $const$noSkip: $.Parser<$$.$const$noSkip> = $.left(
  $.str("const"),
  $.lookNeg(idPart$noSkip),
);
export const keyword$noSkip: $.Parser<$$.keyword$noSkip> = $.alt(
  fun$noSkip,
  $.alt(
    $let$noSkip,
    $.alt(
      $return$noSkip,
      $.alt(
        receive$noSkip,
        $.alt(
          extend$noSkip,
          $.alt(
            $native$noSkip,
            $.alt(
              primitive$noSkip,
              $.alt(
                $public$noSkip,
                $.alt(
                  $null$noSkip,
                  $.alt(
                    $if$noSkip,
                    $.alt(
                      $else$noSkip,
                      $.alt(
                        $while$noSkip,
                        $.alt(
                          repeat$noSkip,
                          $.alt(
                            $do$noSkip,
                            $.alt(
                              until$noSkip,
                              $.alt(
                                $try$noSkip,
                                $.alt(
                                  $catch$noSkip,
                                  $.alt(
                                    foreach$noSkip,
                                    $.alt(
                                      $as$noSkip,
                                      $.alt(
                                        map$noSkip,
                                        $.alt(
                                          mutates$noSkip,
                                          $.alt(
                                            $extends$noSkip,
                                            $.alt(
                                              external$noSkip,
                                              $.alt(
                                                $import$noSkip,
                                                $.alt(
                                                  $with$noSkip,
                                                  $.alt(
                                                    trait$noSkip,
                                                    $.alt(
                                                      initOf$noSkip,
                                                      $.alt(
                                                        override$noSkip,
                                                        $.alt(
                                                          $abstract$noSkip,
                                                          $.alt(
                                                            virtual$noSkip,
                                                            $.alt(
                                                              inline$noSkip,
                                                              $const$noSkip,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const reservedWord$noSkip: $.Parser<$$.reservedWord$noSkip> = $.left(
  keyword$noSkip,
  $.lookNeg(idPart$noSkip),
);
export const Id: $.Parser<$$.Id> = $.field(
  $.pure("Id"),
  "$",
  $.field(
    $.left(
      $.stry(
        $.right(
          $.lookNeg(reservedWord$noSkip),
          $.right(
            $.regex<string | "_">("a-z_", true),
            $.right($.star(idPart$noSkip), $.eps),
          ),
        ),
      ),
      $.star(space$noSkip),
    ),
    "name",
    $.eps,
  ),
);
export const inter = <A, B>(
  A: $.Parser<A>,
  B: $.Parser<B>,
): $.Parser<$$.inter<A, B>> =>
  $.field(
    $.ref(() => A),
    "head",
    $.field(
      $.star(
        $.field(
          $.ref(() => B),
          "op",
          $.field(
            $.ref(() => A),
            "right",
            $.eps,
          ),
        ),
      ),
      "tail",
      $.eps,
    ),
  );
export const TypeOptional: $.Parser<$$.TypeOptional> = $.field(
  $.pure("TypeOptional"),
  "$",
  $.field(
    TypeId,
    "child",
    $.right($.left($.str("?"), $.star(space$noSkip)), $.eps),
  ),
);
export const TypeRegular: $.Parser<$$.TypeRegular> = $.field(
  $.pure("TypeRegular"),
  "$",
  $.field(TypeId, "child", $.eps),
);
export const map: $.Parser<$$.map> = $.left(
  $.left($.str("map"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $as: $.Parser<$$.$as> = $.left(
  $.left($.str("as"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const TypeMap: $.Parser<$$.TypeMap> = $.field(
  $.pure("TypeMap"),
  "$",
  $.right(
    map,
    $.right(
      $.left($.str("<"), $.star(space$noSkip)),
      $.field(
        TypeId,
        "key",
        $.field(
          $.opt($.right($as, Id)),
          "keyAs",
          $.right(
            $.left($.str(","), $.star(space$noSkip)),
            $.field(
              TypeId,
              "value",
              $.field(
                $.opt($.right($as, Id)),
                "valueAs",
                $.right($.left($.str(">"), $.star(space$noSkip)), $.eps),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const TypeBounced: $.Parser<$$.TypeBounced> = $.field(
  $.pure("TypeBounced"),
  "$",
  $.right(
    $.left($.str("bounced"), $.star(space$noSkip)),
    $.right(
      $.left($.str("<"), $.star(space$noSkip)),
      $.field(
        TypeId,
        "child",
        $.right($.left($.str(">"), $.star(space$noSkip)), $.eps),
      ),
    ),
  ),
);
export const $type: $.Parser<$$.$type> = $.alt(
  TypeOptional,
  $.alt(TypeRegular, $.alt(TypeMap, TypeBounced)),
);
export const ascription: $.Parser<$$.ascription> = $.right(
  $.left($.str(":"), $.star(space$noSkip)),
  $type,
);
export const Parameter: $.Parser<$$.Parameter> = $.field(
  $.pure("Parameter"),
  "$",
  $.field(Id, "name", $.field(ascription, "type", $.eps)),
);
export const parametersFormal: $.Parser<$$.parametersFormal> = $.right(
  $.left($.str("("), $.star(space$noSkip)),
  $.left(
    $.opt(inter(Parameter, $.left($.str(","), $.star(space$noSkip)))),
    $.left(
      $.opt($.left($.str(","), $.star(space$noSkip))),
      $.left($.str(")"), $.star(space$noSkip)),
    ),
  ),
);
export const $let: $.Parser<$$.$let> = $.left(
  $.left($.str("let"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const hexDigit: $.Parser<$$.hexDigit> = $.left(
  $.regex<string | string>("0-9a-f", true),
  $.star(space$noSkip),
);
export const IntegerLiteralHex: $.Parser<$$.IntegerLiteralHex> = $.field(
  $.pure("IntegerLiteralHex"),
  "$",
  $.right(
    $.left($.str("0"), $.star(space$noSkip)),
    $.right(
      $.left($.regex<"x">("x", true), $.star(space$noSkip)),
      $.field(
        $.stry(
          $.right(
            hexDigit,
            $.right(
              $.star(
                $.right(
                  $.opt($.left($.str("_"), $.star(space$noSkip))),
                  $.right(hexDigit, $.eps),
                ),
              ),
              $.eps,
            ),
          ),
        ),
        "digits",
        $.eps,
      ),
    ),
  ),
);
export const IntegerLiteralBin: $.Parser<$$.IntegerLiteralBin> = $.field(
  $.pure("IntegerLiteralBin"),
  "$",
  $.right(
    $.left($.str("0"), $.star(space$noSkip)),
    $.right(
      $.left($.regex<"b">("b", true), $.star(space$noSkip)),
      $.field(
        $.stry(
          $.right(
            $.left($.regex<"0" | "1">("01", false), $.star(space$noSkip)),
            $.right(
              $.star(
                $.right(
                  $.opt($.left($.str("_"), $.star(space$noSkip))),
                  $.right(
                    $.left(
                      $.regex<"0" | "1">("01", false),
                      $.star(space$noSkip),
                    ),
                    $.eps,
                  ),
                ),
              ),
              $.eps,
            ),
          ),
        ),
        "digits",
        $.eps,
      ),
    ),
  ),
);
export const IntegerLiteralOct: $.Parser<$$.IntegerLiteralOct> = $.field(
  $.pure("IntegerLiteralOct"),
  "$",
  $.right(
    $.left($.str("0"), $.star(space$noSkip)),
    $.right(
      $.left($.regex<"o">("o", true), $.star(space$noSkip)),
      $.field(
        $.stry(
          $.right(
            $.left($.regex<string>("0-7", false), $.star(space$noSkip)),
            $.right(
              $.star(
                $.right(
                  $.opt($.left($.str("_"), $.star(space$noSkip))),
                  $.right(
                    $.left($.regex<string>("0-7", false), $.star(space$noSkip)),
                    $.eps,
                  ),
                ),
              ),
              $.eps,
            ),
          ),
        ),
        "digits",
        $.eps,
      ),
    ),
  ),
);
export const digit: $.Parser<$$.digit> = $.left(
  $.regex<string>("0-9", false),
  $.star(space$noSkip),
);
export const IntegerLiteralDec: $.Parser<$$.IntegerLiteralDec> = $.field(
  $.pure("IntegerLiteralDec"),
  "$",
  $.field(
    $.stry(
      $.alt(
        $.right(
          $.left($.regex<string>("1-9", false), $.star(space$noSkip)),
          $.right(
            $.star(
              $.right(
                $.opt($.left($.str("_"), $.star(space$noSkip))),
                $.right(digit, $.eps),
              ),
            ),
            $.eps,
          ),
        ),
        $.right(
          $.left($.str("0"), $.star(space$noSkip)),
          $.right($.star(digit), $.eps),
        ),
      ),
    ),
    "digits",
    $.eps,
  ),
);
export const integerLiteral: $.Parser<$$.integerLiteral> = $.alt(
  IntegerLiteralHex,
  $.alt(IntegerLiteralBin, $.alt(IntegerLiteralOct, IntegerLiteralDec)),
);
export const idPart: $.Parser<$$.idPart> = $.left(
  $.regex<string | string | "_">("a-z0-9_", true),
  $.star(space$noSkip),
);
export const BoolLiteral: $.Parser<$$.BoolLiteral> = $.field(
  $.pure("BoolLiteral"),
  "$",
  $.field(
    $.alt(
      $.left($.str("true"), $.star(space$noSkip)),
      $.left($.str("false"), $.star(space$noSkip)),
    ),
    "value",
    $.right($.lookNeg(idPart), $.eps),
  ),
);
export const initOf: $.Parser<$$.initOf> = $.left(
  $.left($.str("initOf"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $null: $.Parser<$$.$null> = $.left(
  $.left($.str("null"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const SuffixUnboxNotNull: $.Parser<$$.SuffixUnboxNotNull> = $.field(
  $.pure("SuffixUnboxNotNull"),
  "$",
  $.right($.left($.str("!!"), $.star(space$noSkip)), $.eps),
);
export const SuffixFieldAccess: $.Parser<$$.SuffixFieldAccess> = $.field(
  $.pure("SuffixFieldAccess"),
  "$",
  $.right($.left($.str("."), $.star(space$noSkip)), $.field(Id, "name", $.eps)),
);
export const SuffixCall: $.Parser<$$.SuffixCall> = $.field(
  $.pure("SuffixCall"),
  "$",
  $.field(
    $.ref(() => parametersFactual),
    "params",
    $.eps,
  ),
);
export const suffix: $.Parser<$$.suffix> = $.alt(
  SuffixUnboxNotNull,
  $.alt(SuffixCall, SuffixFieldAccess),
);
export const parametersFactual: $.Parser<$$.parametersFactual> = $.right(
  $.left($.str("("), $.star(space$noSkip)),
  $.left(
    $.opt(
      inter(
        $.ref(() => expression),
        $.left($.str(","), $.star(space$noSkip)),
      ),
    ),
    $.left(
      $.opt($.left($.str(","), $.star(space$noSkip))),
      $.left($.str(")"), $.star(space$noSkip)),
    ),
  ),
);
export const InitOf: $.Parser<$$.InitOf> = $.field(
  $.pure("InitOf"),
  "$",
  $.right(
    initOf,
    $.field(Id, "name", $.field(parametersFactual, "params", $.eps)),
  ),
);
export const structFieldInitializer: $.Parser<$$.structFieldInitializer> =
  $.field(
    Id,
    "name",
    $.field(
      $.opt(
        $.right(
          $.left($.str(":"), $.star(space$noSkip)),
          $.ref(() => expression),
        ),
      ),
      "init",
      $.eps,
    ),
  );
export const StructInstance: $.Parser<$$.StructInstance> = $.field(
  $.pure("StructInstance"),
  "$",
  $.right(
    TypeId,
    $.right(
      $.left($.str("{"), $.star(space$noSkip)),
      $.field(
        $.opt(
          inter(
            structFieldInitializer,
            $.left($.str(","), $.star(space$noSkip)),
          ),
        ),
        "fields",
        $.right(
          $.opt($.left($.str(","), $.star(space$noSkip))),
          $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
        ),
      ),
    ),
  ),
);
export const parens: $.Parser<$$.parens> = $.right(
  $.left($.str("("), $.star(space$noSkip)),
  $.left(
    $.ref(() => expression),
    $.left($.str(")"), $.star(space$noSkip)),
  ),
);
export const Parens: $.Parser<$$.Parens> = $.field(
  $.pure("Parens"),
  "$",
  $.right(parens, $.eps),
);
export const primary: $.Parser<$$.primary> = $.alt(
  Parens,
  $.alt(
    StructInstance,
    $.alt(
      integerLiteral,
      $.alt(BoolLiteral, $.alt(InitOf, $.alt($null, $.alt(StringLiteral, Id)))),
    ),
  ),
);
export const Suffix: $.Parser<$$.Suffix> = $.field(
  $.pure("Suffix"),
  "$",
  $.field(primary, "expression", $.field($.star(suffix), "suffixes", $.eps)),
);
export const Unary: $.Parser<$$.Unary> = $.field(
  $.pure("Unary"),
  "$",
  $.field(
    $.star(
      $.left(
        $.regex<"-" | "+" | "!" | "~">("-+!~", false),
        $.star(space$noSkip),
      ),
    ),
    "prefixes",
    $.field(Suffix, "expression", $.eps),
  ),
);
export const Mul: $.Parser<$$.Mul> = $.field(
  $.pure("Mul"),
  "$",
  $.right(
    inter(
      Unary,
      $.left($.regex<"*" | "/" | "%">("*/%", false), $.star(space$noSkip)),
    ),
    $.eps,
  ),
);
export const Add: $.Parser<$$.Add> = $.field(
  $.pure("Add"),
  "$",
  $.right(
    inter(
      Mul,
      $.alt(
        $.right(
          $.left($.str("+"), $.star(space$noSkip)),
          $.right($.lookNeg($.left($.str("+"), $.star(space$noSkip))), $.eps),
        ),
        $.right(
          $.left($.str("-"), $.star(space$noSkip)),
          $.right($.lookNeg($.left($.str("-"), $.star(space$noSkip))), $.eps),
        ),
      ),
    ),
    $.eps,
  ),
);
export const BitwiseShift: $.Parser<$$.BitwiseShift> = $.field(
  $.pure("BitwiseShift"),
  "$",
  $.right(
    inter(
      Add,
      $.alt(
        $.left($.str("<<"), $.star(space$noSkip)),
        $.left($.str(">>"), $.star(space$noSkip)),
      ),
    ),
    $.eps,
  ),
);
export const Compare: $.Parser<$$.Compare> = $.field(
  $.pure("Compare"),
  "$",
  $.right(
    inter(
      BitwiseShift,
      $.alt(
        $.left($.str("<="), $.star(space$noSkip)),
        $.alt(
          $.left($.str("<"), $.star(space$noSkip)),
          $.alt(
            $.left($.str(">="), $.star(space$noSkip)),
            $.left($.str(">"), $.star(space$noSkip)),
          ),
        ),
      ),
    ),
    $.eps,
  ),
);
export const Equality: $.Parser<$$.Equality> = $.field(
  $.pure("Equality"),
  "$",
  $.right(
    inter(
      Compare,
      $.alt(
        $.left($.str("!="), $.star(space$noSkip)),
        $.left($.str("=="), $.star(space$noSkip)),
      ),
    ),
    $.eps,
  ),
);
export const BitwiseAnd: $.Parser<$$.BitwiseAnd> = $.field(
  $.pure("BitwiseAnd"),
  "$",
  $.right(inter(Equality, $.left($.str("&"), $.star(space$noSkip))), $.eps),
);
export const BitwiseXor: $.Parser<$$.BitwiseXor> = $.field(
  $.pure("BitwiseXor"),
  "$",
  $.right(inter(BitwiseAnd, $.left($.str("^"), $.star(space$noSkip))), $.eps),
);
export const BitwiseOr: $.Parser<$$.BitwiseOr> = $.field(
  $.pure("BitwiseOr"),
  "$",
  $.right(inter(BitwiseXor, $.left($.str("|"), $.star(space$noSkip))), $.eps),
);
export const And: $.Parser<$$.And> = $.field(
  $.pure("And"),
  "$",
  $.right(inter(BitwiseOr, $.left($.str("&&"), $.star(space$noSkip))), $.eps),
);
export const Or: $.Parser<$$.Or> = $.field(
  $.pure("Or"),
  "$",
  $.right(inter(And, $.left($.str("||"), $.star(space$noSkip))), $.eps),
);
export const Conditional: $.Parser<$$.Conditional> = $.field(
  $.pure("Conditional"),
  "$",
  $.field(
    Or,
    "head",
    $.field(
      $.star(
        $.right(
          $.left($.str("?"), $.star(space$noSkip)),
          $.field(
            Or,
            "thenBranch",
            $.right(
              $.left($.str(":"), $.star(space$noSkip)),
              $.field(
                $.ref(() => Conditional),
                "elseBranch",
                $.eps,
              ),
            ),
          ),
        ),
      ),
      "tail",
      $.eps,
    ),
  ),
);
export const expression: $.Parser<$$.expression> = Conditional;
export const StatementLet: $.Parser<$$.StatementLet> = $.field(
  $.pure("StatementLet"),
  "$",
  $.right(
    $let,
    $.field(
      Id,
      "name",
      $.field(
        $.opt(ascription),
        "type",
        $.right(
          $.left($.str("="), $.star(space$noSkip)),
          $.field(
            expression,
            "init",
            $.right(
              $.alt(
                $.left($.str(";"), $.star(space$noSkip)),
                $.lookPos($.left($.str("}"), $.star(space$noSkip))),
              ),
              $.eps,
            ),
          ),
        ),
      ),
    ),
  ),
);
export const $return: $.Parser<$$.$return> = $.left(
  $.left($.str("return"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const StatementReturn: $.Parser<$$.StatementReturn> = $.field(
  $.pure("StatementReturn"),
  "$",
  $.right(
    $return,
    $.field(
      $.opt(expression),
      "expression",
      $.right(
        $.alt(
          $.left($.str(";"), $.star(space$noSkip)),
          $.lookPos($.left($.str("}"), $.star(space$noSkip))),
        ),
        $.eps,
      ),
    ),
  ),
);
export const $if: $.Parser<$$.$if> = $.left(
  $.left($.str("if"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $else: $.Parser<$$.$else> = $.left(
  $.left($.str("else"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $while: $.Parser<$$.$while> = $.left(
  $.left($.str("while"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const repeat: $.Parser<$$.repeat> = $.left(
  $.left($.str("repeat"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $do: $.Parser<$$.$do> = $.left(
  $.left($.str("do"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const until: $.Parser<$$.until> = $.left(
  $.left($.str("until"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $try: $.Parser<$$.$try> = $.left(
  $.left($.str("try"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $catch: $.Parser<$$.$catch> = $.left(
  $.left($.str("catch"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const foreach: $.Parser<$$.foreach> = $.left(
  $.left($.str("foreach"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const StatementExpression: $.Parser<$$.StatementExpression> = $.field(
  $.pure("StatementExpression"),
  "$",
  $.field(
    expression,
    "expression",
    $.right(
      $.alt(
        $.left($.str(";"), $.star(space$noSkip)),
        $.lookPos($.left($.str("}"), $.star(space$noSkip))),
      ),
      $.eps,
    ),
  ),
);
export const StatementAssign: $.Parser<$$.StatementAssign> = $.field(
  $.pure("StatementAssign"),
  "$",
  $.field(
    expression,
    "left",
    $.field(
      $.opt(
        $.left(
          $.regex<"-" | "+" | "*" | "/" | "%" | "|" | "&" | "^">(
            "-+*/%|&^",
            false,
          ),
          $.star(space$noSkip),
        ),
      ),
      "operator",
      $.right(
        $.left($.str("="), $.star(space$noSkip)),
        $.field(
          expression,
          "right",
          $.right(
            $.alt(
              $.left($.str(";"), $.star(space$noSkip)),
              $.lookPos($.left($.str("}"), $.star(space$noSkip))),
            ),
            $.eps,
          ),
        ),
      ),
    ),
  ),
);
export const StatementForEach: $.Parser<$$.StatementForEach> = $.field(
  $.pure("StatementForEach"),
  "$",
  $.right(
    foreach,
    $.right(
      $.left($.str("("), $.star(space$noSkip)),
      $.field(
        Id,
        "key",
        $.right(
          $.left($.str(","), $.star(space$noSkip)),
          $.field(
            Id,
            "value",
            $.right(
              $.left($.str("in"), $.star(space$noSkip)),
              $.field(
                expression,
                "expression",
                $.right(
                  $.left($.str(")"), $.star(space$noSkip)),
                  $.field(
                    $.ref(() => statements),
                    "body",
                    $.eps,
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const StatementTry: $.Parser<$$.StatementTry> = $.field(
  $.pure("StatementTry"),
  "$",
  $.right(
    $try,
    $.field(
      $.ref(() => statements),
      "body",
      $.field(
        $.opt(
          $.right(
            $catch,
            $.right(
              $.left($.str("("), $.star(space$noSkip)),
              $.field(
                Id,
                "name",
                $.right(
                  $.left($.str(")"), $.star(space$noSkip)),
                  $.field(
                    $.ref(() => statements),
                    "body2",
                    $.eps,
                  ),
                ),
              ),
            ),
          ),
        ),
        "handler",
        $.eps,
      ),
    ),
  ),
);
export const StatementUntil: $.Parser<$$.StatementUntil> = $.field(
  $.pure("StatementUntil"),
  "$",
  $.right(
    $do,
    $.field(
      $.ref(() => statements),
      "body",
      $.right(
        until,
        $.field(
          parens,
          "condition",
          $.right(
            $.alt(
              $.left($.str(";"), $.star(space$noSkip)),
              $.lookPos($.left($.str("}"), $.star(space$noSkip))),
            ),
            $.eps,
          ),
        ),
      ),
    ),
  ),
);
export const StatementRepeat: $.Parser<$$.StatementRepeat> = $.field(
  $.pure("StatementRepeat"),
  "$",
  $.right(
    repeat,
    $.field(
      parens,
      "condition",
      $.field(
        $.ref(() => statements),
        "body",
        $.eps,
      ),
    ),
  ),
);
export const StatementWhile: $.Parser<$$.StatementWhile> = $.field(
  $.pure("StatementWhile"),
  "$",
  $.right(
    $while,
    $.field(
      parens,
      "condition",
      $.field(
        $.ref(() => statements),
        "body",
        $.eps,
      ),
    ),
  ),
);
export const StatementCondition: $.Parser<$$.StatementCondition> = $.field(
  $.pure("StatementCondition"),
  "$",
  $.right(
    $if,
    $.field(
      expression,
      "condition",
      $.field(
        $.ref(() => statements),
        "trueBranch",
        $.field(
          $.opt(
            $.right(
              $else,
              $.alt(
                $.ref(() => statements),
                $.ref(() => StatementCondition),
              ),
            ),
          ),
          "falseBranch",
          $.eps,
        ),
      ),
    ),
  ),
);
export const StatementBlock: $.Parser<$$.StatementBlock> = $.field(
  $.pure("StatementBlock"),
  "$",
  $.field(
    $.ref(() => statements),
    "body",
    $.eps,
  ),
);
export const statement: $.Parser<$$.statement> = $.alt(
  StatementLet,
  $.alt(
    StatementBlock,
    $.alt(
      StatementReturn,
      $.alt(
        StatementCondition,
        $.alt(
          StatementWhile,
          $.alt(
            StatementRepeat,
            $.alt(
              StatementUntil,
              $.alt(
                StatementTry,
                $.alt(
                  StatementForEach,
                  $.alt(StatementExpression, StatementAssign),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const statements: $.Parser<$$.statements> = $.right(
  $.left($.str("{"), $.star(space$noSkip)),
  $.left($.star(statement), $.left($.str("}"), $.star(space$noSkip))),
);
export const FunctionDefinition: $.Parser<$$.FunctionDefinition> = $.field(
  $.pure("FunctionDefinition"),
  "$",
  $.field(statements, "body", $.eps),
);
export const FunctionDeclaration: $.Parser<$$.FunctionDeclaration> = $.field(
  $.pure("FunctionDeclaration"),
  "$",
  $.right(
    $.stry(
      $.alt(
        $.left($.str(";"), $.star(space$noSkip)),
        $.lookPos($.left($.str("}"), $.star(space$noSkip))),
      ),
    ),
    $.eps,
  ),
);
export const Function: $.Parser<$$.Function> = $.field(
  $.pure("Function"),
  "$",
  $.field(
    $.star(functionAttribute),
    "attributes",
    $.right(
      fun,
      $.field(
        Id,
        "name",
        $.field(
          parametersFormal,
          "parameters",
          $.field(
            $.opt(ascription),
            "type",
            $.field(
              $.alt(FunctionDefinition, FunctionDeclaration),
              "body",
              $.eps,
            ),
          ),
        ),
      ),
    ),
  ),
);
export const AsmData: $.Parser<$$.AsmData> = $.field(
  $.pure("AsmData"),
  "$",
  $.right(
    $.right(
      $.left($.regex<"x" | "b">("xb", true), $.star(space$noSkip)),
      $.right(
        $.left($.str("{"), $.star(space$noSkip)),
        $.right(
          $.star(hexDigit),
          $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
        ),
      ),
    ),
    $.eps,
  ),
);
export const multiLineComment: $.Parser<$$.multiLineComment> = $.right(
  $.left($.str("/*"), $.star(space$noSkip)),
  $.left(
    $.stry(
      $.star(
        $.right(
          $.lookNeg($.left($.str("*/"), $.star(space$noSkip))),
          $.right($.left($.any, $.star(space$noSkip)), $.eps),
        ),
      ),
    ),
    $.left($.str("*/"), $.star(space$noSkip)),
  ),
);
export const singleLineComment: $.Parser<$$.singleLineComment> = $.right(
  $.left($.str("//"), $.star(space$noSkip)),
  $.stry(
    $.star(
      $.left($.regex<"\r" | "\n">("^\\r\\n", false), $.star(space$noSkip)),
    ),
  ),
);
export const comment: $.Parser<$$.comment> = $.alt(
  multiLineComment,
  singleLineComment,
);
export const space: $.Parser<$$.space> = $.alt(
  $.left(
    $.regex<" " | "\t" | "\r" | "\n">(" \\t\\r\\n", false),
    $.star(space$noSkip),
  ),
  comment,
);
export const AsmAny: $.Parser<$$.AsmAny> = $.field(
  $.pure("AsmAny"),
  "$",
  $.right(
    $.right(
      $.lookNeg(comment),
      $.right(
        $.plus(
          $.right(
            $.lookNeg(space),
            $.right(
              $.lookNeg($.left($.str("}"), $.star(space$noSkip))),
              $.right($.left($.any, $.star(space$noSkip)), $.eps),
            ),
          ),
        ),
        $.eps,
      ),
    ),
    $.eps,
  ),
);
export const asmInstruction: $.Parser<$$.asmInstruction> = $.alt(
  AsmData,
  AsmAny,
);
export const AsmFunction: $.Parser<$$.AsmFunction> = $.field(
  $.pure("AsmFunction"),
  "$",
  $.right(
    $.left($.str("asm"), $.star(space$noSkip)),
    $.field(
      $.opt(
        $.right(
          $.left($.str("("), $.star(space$noSkip)),
          $.field(
            $.star(Id),
            "ids",
            $.field(
              $.opt(
                $.right(
                  $.left($.str("->"), $.star(space$noSkip)),
                  $.plus(IntegerLiteralDec),
                ),
              ),
              "to",
              $.right($.left($.str(")"), $.star(space$noSkip)), $.eps),
            ),
          ),
        ),
      ),
      "shuffle",
      $.field(
        $.star(functionAttribute),
        "attributes",
        $.right(
          fun,
          $.field(
            Id,
            "name",
            $.field(
              parametersFormal,
              "parameters",
              $.field(
                $.opt(ascription),
                "returnType",
                $.right(
                  $.left($.str("{"), $.star(space$noSkip)),
                  $.field(
                    $.plus(asmInstruction),
                    "instructions",
                    $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const funcQuotedId: $.Parser<$$.funcQuotedId> = $.right(
  $.left($.str("`"), $.star(space$noSkip)),
  $.left(
    $.stry(
      $.plus(
        $.right(
          $.lookNeg(
            $.left($.regex<"`" | "\n">("`\\n", false), $.star(space$noSkip)),
          ),
          $.right($.left($.any, $.star(space$noSkip)), $.eps),
        ),
      ),
    ),
    $.left($.str("`"), $.star(space$noSkip)),
  ),
);
export const notUnderscore: $.Parser<$$.notUnderscore> = $.left(
  $.str("_"),
  $.star(space$noSkip),
);
export const notArithOperator: $.Parser<$$.notArithOperator> = $.alt(
  $.left($.str("+"), $.star(space$noSkip)),
  $.alt(
    $.left($.str("-"), $.star(space$noSkip)),
    $.alt(
      $.left($.str("*"), $.star(space$noSkip)),
      $.alt(
        $.left($.str("/%"), $.star(space$noSkip)),
        $.alt(
          $.left($.str("/"), $.star(space$noSkip)),
          $.alt(
            $.left($.str("%"), $.star(space$noSkip)),
            $.alt(
              $.left($.str("~/"), $.star(space$noSkip)),
              $.alt(
                $.left($.str("^/"), $.star(space$noSkip)),
                $.alt(
                  $.left($.str("~%"), $.star(space$noSkip)),
                  $.left($.str("^%"), $.star(space$noSkip)),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notComparisonOperator: $.Parser<$$.notComparisonOperator> = $.alt(
  $.left($.str("<=>"), $.star(space$noSkip)),
  $.alt(
    $.left($.str("<="), $.star(space$noSkip)),
    $.alt(
      $.left($.str("<"), $.star(space$noSkip)),
      $.alt(
        $.left($.str(">="), $.star(space$noSkip)),
        $.alt(
          $.left($.str(">"), $.star(space$noSkip)),
          $.alt(
            $.left($.str("!="), $.star(space$noSkip)),
            $.left($.str("=="), $.star(space$noSkip)),
          ),
        ),
      ),
    ),
  ),
);
export const notBitwiseOperator: $.Parser<$$.notBitwiseOperator> = $.alt(
  $.left($.str("~>>"), $.star(space$noSkip)),
  $.alt(
    $.left($.str("~"), $.star(space$noSkip)),
    $.alt(
      $.left($.str("^>>"), $.star(space$noSkip)),
      $.alt(
        $.left($.str("^"), $.star(space$noSkip)),
        $.alt(
          $.left($.str("&"), $.star(space$noSkip)),
          $.alt(
            $.left($.str("|"), $.star(space$noSkip)),
            $.alt(
              $.left($.str("<<"), $.star(space$noSkip)),
              $.left($.str(">>"), $.star(space$noSkip)),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notAssignOperator: $.Parser<$$.notAssignOperator> = $.alt(
  $.left($.str("="), $.star(space$noSkip)),
  $.alt(
    $.left($.str("+="), $.star(space$noSkip)),
    $.alt(
      $.left($.str("-="), $.star(space$noSkip)),
      $.alt(
        $.left($.str("*="), $.star(space$noSkip)),
        $.alt(
          $.left($.str("/="), $.star(space$noSkip)),
          $.alt(
            $.left($.str("%="), $.star(space$noSkip)),
            $.alt(
              $.left($.str("~>>="), $.star(space$noSkip)),
              $.alt(
                $.left($.str("~/="), $.star(space$noSkip)),
                $.alt(
                  $.left($.str("~%="), $.star(space$noSkip)),
                  $.alt(
                    $.left($.str("^>>="), $.star(space$noSkip)),
                    $.alt(
                      $.left($.str("^/="), $.star(space$noSkip)),
                      $.alt(
                        $.left($.str("^%="), $.star(space$noSkip)),
                        $.alt(
                          $.left($.str("^="), $.star(space$noSkip)),
                          $.alt(
                            $.left($.str("<<="), $.star(space$noSkip)),
                            $.alt(
                              $.left($.str(">>="), $.star(space$noSkip)),
                              $.alt(
                                $.left($.str("&="), $.star(space$noSkip)),
                                $.left($.str("|="), $.star(space$noSkip)),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notDelimiter: $.Parser<$$.notDelimiter> = $.alt(
  $.left($.str("["), $.star(space$noSkip)),
  $.alt(
    $.left($.str("]"), $.star(space$noSkip)),
    $.alt(
      $.left($.str("{"), $.star(space$noSkip)),
      $.alt(
        $.left($.str("}"), $.star(space$noSkip)),
        $.alt(
          $.left($.str("?"), $.star(space$noSkip)),
          $.left($.str(":"), $.star(space$noSkip)),
        ),
      ),
    ),
  ),
);
export const notControlKeyword: $.Parser<$$.notControlKeyword> = $.alt(
  $.left($.str("return"), $.star(space$noSkip)),
  $.alt(
    $.left($.str("var"), $.star(space$noSkip)),
    $.alt(
      $.left($.str("repeat"), $.star(space$noSkip)),
      $.alt(
        $.left($.str("do"), $.star(space$noSkip)),
        $.alt(
          $.left($.str("while"), $.star(space$noSkip)),
          $.alt(
            $.left($.str("until"), $.star(space$noSkip)),
            $.alt(
              $.left($.str("try"), $.star(space$noSkip)),
              $.alt(
                $.left($.str("catch"), $.star(space$noSkip)),
                $.alt(
                  $.left($.str("ifnot"), $.star(space$noSkip)),
                  $.alt(
                    $.left($.str("if"), $.star(space$noSkip)),
                    $.alt(
                      $.left($.str("then"), $.star(space$noSkip)),
                      $.alt(
                        $.left($.str("elseifnot"), $.star(space$noSkip)),
                        $.alt(
                          $.left($.str("elseif"), $.star(space$noSkip)),
                          $.left($.str("else"), $.star(space$noSkip)),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notTypeKeyword: $.Parser<$$.notTypeKeyword> = $.alt(
  $.left($.str("int"), $.star(space$noSkip)),
  $.alt(
    $.left($.str("cell"), $.star(space$noSkip)),
    $.alt(
      $.left($.str("builder"), $.star(space$noSkip)),
      $.alt(
        $.left($.str("slice"), $.star(space$noSkip)),
        $.alt(
          $.left($.str("cont"), $.star(space$noSkip)),
          $.alt(
            $.left($.str("tuple"), $.star(space$noSkip)),
            $.alt(
              $.left($.str("type"), $.star(space$noSkip)),
              $.alt(
                $.left($.str("->"), $.star(space$noSkip)),
                $.left($.str("forall"), $.star(space$noSkip)),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notKeyword: $.Parser<$$.notKeyword> = $.alt(
  $.left($.str("extern"), $.star(space$noSkip)),
  $.alt(
    $.left($.str("global"), $.star(space$noSkip)),
    $.alt(
      $.left($.str("asm"), $.star(space$noSkip)),
      $.alt(
        $.left($.str("impure"), $.star(space$noSkip)),
        $.alt(
          $.left($.str("inline_ref"), $.star(space$noSkip)),
          $.alt(
            $.left($.str("inline"), $.star(space$noSkip)),
            $.alt(
              $.left($.str("auto_apply"), $.star(space$noSkip)),
              $.alt(
                $.left($.str("method_id"), $.star(space$noSkip)),
                $.alt(
                  $.left($.str("operator"), $.star(space$noSkip)),
                  $.alt(
                    $.left($.str("infixl"), $.star(space$noSkip)),
                    $.alt(
                      $.left($.str("infixr"), $.star(space$noSkip)),
                      $.alt(
                        $.left($.str("infix"), $.star(space$noSkip)),
                        $.left($.str("const"), $.star(space$noSkip)),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notDirective: $.Parser<$$.notDirective> = $.alt(
  $.left($.str("#include"), $.star(space$noSkip)),
  $.left($.str("#pragma"), $.star(space$noSkip)),
);
export const notDecimalNumber: $.Parser<$$.notDecimalNumber> = $.stry(
  $.right(
    $.opt($.left($.str("-"), $.star(space$noSkip))),
    $.right($.plus(digit), $.eps),
  ),
);
export const notHexadecimalNumber: $.Parser<$$.notHexadecimalNumber> = $.stry(
  $.right(
    $.opt($.left($.str("-"), $.star(space$noSkip))),
    $.right(
      $.left($.str("0x"), $.star(space$noSkip)),
      $.right($.plus(hexDigit), $.eps),
    ),
  ),
);
export const funcInvalidId: $.Parser<$$.funcInvalidId> = $.alt(
  notUnderscore,
  $.alt(
    notArithOperator,
    $.alt(
      notComparisonOperator,
      $.alt(
        notBitwiseOperator,
        $.alt(
          notAssignOperator,
          $.alt(
            notDelimiter,
            $.alt(
              notControlKeyword,
              $.alt(
                notTypeKeyword,
                $.alt(
                  notKeyword,
                  $.alt(
                    notDirective,
                    $.alt(notDecimalNumber, notHexadecimalNumber),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const whiteSpace: $.Parser<$$.whiteSpace> = $.left(
  $.regex<" " | "\t" | "\r" | "\n">(" \\t\\r\\n", false),
  $.star(space$noSkip),
);
export const funcPlainId: $.Parser<$$.funcPlainId> = $.stry(
  $.right(
    $.lookNeg(
      $.right(
        funcInvalidId,
        $.right($.left($.str(")"), $.star(space$noSkip)), $.eps),
      ),
    ),
    $.right(
      $.plus(
        $.right(
          $.lookNeg(
            $.alt(
              whiteSpace,
              $.left(
                $.regex<"(" | ")" | "[" | string | "," | "." | ";" | "~">(
                  "()[\\],.;~",
                  false,
                ),
                $.star(space$noSkip),
              ),
            ),
          ),
          $.right($.left($.any, $.star(space$noSkip)), $.eps),
        ),
      ),
      $.eps,
    ),
  ),
);
export const funcId: $.Parser<$$.funcId> = $.right(
  $.lookNeg(
    $.alt(
      $.left($.str('"'), $.star(space$noSkip)),
      $.left($.str("{-"), $.star(space$noSkip)),
    ),
  ),
  $.field(
    $.opt(
      $.alt(
        $.left($.str("."), $.star(space$noSkip)),
        $.left($.str("~"), $.star(space$noSkip)),
      ),
    ),
    "accessor",
    $.field($.alt(funcQuotedId, funcPlainId), "id", $.eps),
  ),
);
export const $native: $.Parser<$$.$native> = $.left(
  $.left($.str("native"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const NativeFunctionDecl: $.Parser<$$.NativeFunctionDecl> = $.field(
  $.pure("NativeFunctionDecl"),
  "$",
  $.right(
    $.left($.str("@name"), $.star(space$noSkip)),
    $.right(
      $.left($.str("("), $.star(space$noSkip)),
      $.field(
        funcId,
        "nativeName",
        $.right(
          $.left($.str(")"), $.star(space$noSkip)),
          $.field(
            $.star(functionAttribute),
            "attributes",
            $.right(
              $native,
              $.field(
                Id,
                "name",
                $.field(
                  parametersFormal,
                  "parameters",
                  $.field(
                    $.opt(ascription),
                    "returnType",
                    $.right($.left($.str(";"), $.star(space$noSkip)), $.eps),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const $const: $.Parser<$$.$const> = $.left(
  $.left($.str("const"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const ConstantDefinition: $.Parser<$$.ConstantDefinition> = $.field(
  $.pure("ConstantDefinition"),
  "$",
  $.right(
    $.left($.str("="), $.star(space$noSkip)),
    $.field(
      expression,
      "expression",
      $.right(
        $.alt(
          $.left($.str(";"), $.star(space$noSkip)),
          $.lookPos($.left($.str("}"), $.star(space$noSkip))),
        ),
        $.eps,
      ),
    ),
  ),
);
export const ConstantDeclaration: $.Parser<$$.ConstantDeclaration> = $.field(
  $.pure("ConstantDeclaration"),
  "$",
  $.right(
    $.stry(
      $.alt(
        $.left($.str(";"), $.star(space$noSkip)),
        $.lookPos($.left($.str("}"), $.star(space$noSkip))),
      ),
    ),
    $.eps,
  ),
);
export const Constant: $.Parser<$$.Constant> = $.field(
  $.pure("Constant"),
  "$",
  $.field(
    $.star($.alt(virtual, $.alt(override, $abstract))),
    "attributes",
    $.right(
      $const,
      $.field(
        Id,
        "name",
        $.field(
          ascription,
          "type",
          $.field(
            $.alt(ConstantDefinition, ConstantDeclaration),
            "body",
            $.eps,
          ),
        ),
      ),
    ),
  ),
);
export const FieldDecl: $.Parser<$$.FieldDecl> = $.field(
  $.pure("FieldDecl"),
  "$",
  $.field(
    Id,
    "name",
    $.field(
      ascription,
      "type",
      $.field(
        $.opt($.right($as, Id)),
        "as",
        $.field(
          $.opt($.right($.left($.str("="), $.star(space$noSkip)), expression)),
          "expression",
          $.eps,
        ),
      ),
    ),
  ),
);
export const structFields: $.Parser<$$.structFields> = $.left(
  $.opt(inter(FieldDecl, $.left($.str(";"), $.star(space$noSkip)))),
  $.opt($.left($.str(";"), $.star(space$noSkip))),
);
export const StructDecl: $.Parser<$$.StructDecl> = $.field(
  $.pure("StructDecl"),
  "$",
  $.right(
    $.left($.str("struct"), $.star(space$noSkip)),
    $.field(
      TypeId,
      "name",
      $.right(
        $.left($.str("{"), $.star(space$noSkip)),
        $.field(
          structFields,
          "fields",
          $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
        ),
      ),
    ),
  ),
);
export const MessageDecl: $.Parser<$$.MessageDecl> = $.field(
  $.pure("MessageDecl"),
  "$",
  $.right(
    $.left($.str("message"), $.star(space$noSkip)),
    $.field(
      $.opt(
        $.right(
          $.left($.str("("), $.star(space$noSkip)),
          $.left(integerLiteral, $.left($.str(")"), $.star(space$noSkip))),
        ),
      ),
      "id",
      $.field(
        TypeId,
        "name",
        $.right(
          $.left($.str("{"), $.star(space$noSkip)),
          $.field(
            structFields,
            "fields",
            $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
          ),
        ),
      ),
    ),
  ),
);
export const ContractAttribute: $.Parser<$$.ContractAttribute> = $.field(
  $.pure("ContractAttribute"),
  "$",
  $.right(
    $.right(
      $.left($.str("@interface"), $.star(space$noSkip)),
      $.right(
        $.left($.str("("), $.star(space$noSkip)),
        $.right(
          StringLiteral,
          $.right($.left($.str(")"), $.star(space$noSkip)), $.eps),
        ),
      ),
    ),
    $.eps,
  ),
);
export const contract: $.Parser<$$.contract> = $.left(
  $.left($.str("contract"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $with: $.Parser<$$.$with> = $.left(
  $.left($.str("with"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const InheritedTraits: $.Parser<$$.InheritedTraits> = $.field(
  $.pure("InheritedTraits"),
  "$",
  $.field(
    inter(Id, $.left($.str(","), $.star(space$noSkip))),
    "ids",
    $.right($.opt($.left($.str(","), $.star(space$noSkip))), $.eps),
  ),
);
export const ContractInit: $.Parser<$$.ContractInit> = $.field(
  $.pure("ContractInit"),
  "$",
  $.right(
    $.right(
      $.left($.str("init"), $.star(space$noSkip)),
      $.right(parametersFormal, $.right(statements, $.eps)),
    ),
    $.eps,
  ),
);
export const receive: $.Parser<$$.receive> = $.left(
  $.left($.str("receive"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const receiverParam: $.Parser<$$.receiverParam> = $.opt(
  $.alt(Parameter, StringLiteral),
);
export const ReceiverReceive: $.Parser<$$.ReceiverReceive> = $.field(
  $.pure("ReceiverReceive"),
  "$",
  $.right(
    receive,
    $.right(
      $.left($.str("("), $.star(space$noSkip)),
      $.field(
        receiverParam,
        "param",
        $.right(
          $.left($.str(")"), $.star(space$noSkip)),
          $.field(statements, "body", $.eps),
        ),
      ),
    ),
  ),
);
export const external: $.Parser<$$.external> = $.left(
  $.left($.str("external"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const ReceiverExternal: $.Parser<$$.ReceiverExternal> = $.field(
  $.pure("ReceiverExternal"),
  "$",
  $.right(
    external,
    $.right(
      $.left($.str("("), $.star(space$noSkip)),
      $.field(
        receiverParam,
        "param",
        $.right(
          $.left($.str(")"), $.star(space$noSkip)),
          $.field(statements, "body", $.eps),
        ),
      ),
    ),
  ),
);
export const ReceiverBounced: $.Parser<$$.ReceiverBounced> = $.field(
  $.pure("ReceiverBounced"),
  "$",
  $.right(
    $.left($.str("bounced"), $.star(space$noSkip)),
    $.right(
      $.left($.str("("), $.star(space$noSkip)),
      $.field(
        Parameter,
        "param",
        $.right(
          $.left($.str(")"), $.star(space$noSkip)),
          $.field(statements, "body", $.eps),
        ),
      ),
    ),
  ),
);
export const receiver: $.Parser<$$.receiver> = $.alt(
  ReceiverReceive,
  $.alt(ReceiverExternal, ReceiverBounced),
);
export const storageVar: $.Parser<$$.storageVar> = $.left(
  FieldDecl,
  $.alt(
    $.left($.str(";"), $.star(space$noSkip)),
    $.lookPos($.left($.str("}"), $.star(space$noSkip))),
  ),
);
export const contractItemDecl: $.Parser<$$.contractItemDecl> = $.alt(
  ContractInit,
  $.alt(receiver, $.alt(Function, $.alt(Constant, storageVar))),
);
export const Contract: $.Parser<$$.Contract> = $.field(
  $.pure("Contract"),
  "$",
  $.field(
    $.star(ContractAttribute),
    "attributes",
    $.right(
      contract,
      $.field(
        Id,
        "name",
        $.field(
          $.opt($.right($with, InheritedTraits)),
          "traits",
          $.right(
            $.left($.str("{"), $.star(space$noSkip)),
            $.field(
              $.star(contractItemDecl),
              "items",
              $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const trait: $.Parser<$$.trait> = $.left(
  $.left($.str("trait"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const traitItemDecl: $.Parser<$$.traitItemDecl> = $.alt(
  receiver,
  $.alt(Function, $.alt(Constant, storageVar)),
);
export const Trait: $.Parser<$$.Trait> = $.field(
  $.pure("Trait"),
  "$",
  $.right(
    $.right(
      $.star(ContractAttribute),
      $.right(
        trait,
        $.right(
          Id,
          $.right(
            $.opt($.right($with, $.right(InheritedTraits, $.eps))),
            $.right(
              $.left($.str("{"), $.star(space$noSkip)),
              $.right(
                $.star(traitItemDecl),
                $.right($.left($.str("}"), $.star(space$noSkip)), $.eps),
              ),
            ),
          ),
        ),
      ),
    ),
    $.eps,
  ),
);
export const moduleItem: $.Parser<$$.moduleItem> = $.alt(
  PrimitiveTypeDecl,
  $.alt(
    Function,
    $.alt(
      AsmFunction,
      $.alt(
        NativeFunctionDecl,
        $.alt(
          Constant,
          $.alt(StructDecl, $.alt(MessageDecl, $.alt(Contract, Trait))),
        ),
      ),
    ),
  ),
);
export const Module: $.Parser<$$.Module> = $.field(
  $.pure("Module"),
  "$",
  $.field(
    $.star(Import),
    "imports",
    $.field($.star(moduleItem), "items", $.eps),
  ),
);
export const StringLiteral$noSkip: $.Parser<$$.StringLiteral$noSkip> = $.field(
  $.pure("StringLiteral"),
  "$",
  $.field(
    $.stry(
      $.right(
        $.str('"'),
        $.right(
          $.star(
            $.alt(
              $.regex<'"' | "\\">('^"\\\\', false),
              $.right($.str("\\"), escapeChar$noSkip),
            ),
          ),
          $.right($.str('"'), $.eps),
        ),
      ),
    ),
    "value",
    $.eps,
  ),
);
export const Import$noSkip: $.Parser<$$.Import$noSkip> = $.field(
  $.pure("Import"),
  "$",
  $.right(
    $import$noSkip,
    $.field(StringLiteral$noSkip, "path", $.right($.str(";"), $.eps)),
  ),
);
export const TypeId$noSkip: $.Parser<$$.TypeId$noSkip> = $.field(
  $.pure("TypeId"),
  "$",
  $.field(
    $.stry(
      $.right(
        $.regex<string>("A-Z", false),
        $.right($.star($.regex<string | string | "_">("a-z0-9_", true)), $.eps),
      ),
    ),
    "name",
    $.eps,
  ),
);
export const PrimitiveTypeDecl$noSkip: $.Parser<$$.PrimitiveTypeDecl$noSkip> =
  $.field(
    $.pure("PrimitiveTypeDecl"),
    "$",
    $.right(
      primitive$noSkip,
      $.field(TypeId$noSkip, "name", $.right($.str(";"), $.eps)),
    ),
  );
export const functionAttribute$noSkip: $.Parser<$$.functionAttribute$noSkip> =
  $.alt(
    $.str("get"),
    $.alt(
      mutates$noSkip,
      $.alt(
        $extends$noSkip,
        $.alt(
          virtual$noSkip,
          $.alt(override$noSkip, $.alt(inline$noSkip, $abstract$noSkip)),
        ),
      ),
    ),
  );
export const Id$noSkip: $.Parser<$$.Id$noSkip> = $.field(
  $.pure("Id"),
  "$",
  $.field(
    $.stry(
      $.right(
        $.lookNeg(reservedWord$noSkip),
        $.right(
          $.regex<string | "_">("a-z_", true),
          $.right($.star(idPart$noSkip), $.eps),
        ),
      ),
    ),
    "name",
    $.eps,
  ),
);
export const inter$noSkip = <A, B>(
  A: $.Parser<A>,
  B: $.Parser<B>,
): $.Parser<$$.inter$noSkip<A, B>> =>
  $.field(
    $.ref(() => A),
    "head",
    $.field(
      $.star(
        $.field(
          $.ref(() => B),
          "op",
          $.field(
            $.ref(() => A),
            "right",
            $.eps,
          ),
        ),
      ),
      "tail",
      $.eps,
    ),
  );
export const TypeOptional$noSkip: $.Parser<$$.TypeOptional$noSkip> = $.field(
  $.pure("TypeOptional"),
  "$",
  $.field(TypeId$noSkip, "child", $.right($.str("?"), $.eps)),
);
export const TypeRegular$noSkip: $.Parser<$$.TypeRegular$noSkip> = $.field(
  $.pure("TypeRegular"),
  "$",
  $.field(TypeId$noSkip, "child", $.eps),
);
export const TypeMap$noSkip: $.Parser<$$.TypeMap$noSkip> = $.field(
  $.pure("TypeMap"),
  "$",
  $.right(
    map$noSkip,
    $.right(
      $.str("<"),
      $.field(
        TypeId$noSkip,
        "key",
        $.field(
          $.opt($.right($as$noSkip, Id$noSkip)),
          "keyAs",
          $.right(
            $.str(","),
            $.field(
              TypeId$noSkip,
              "value",
              $.field(
                $.opt($.right($as$noSkip, Id$noSkip)),
                "valueAs",
                $.right($.str(">"), $.eps),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const TypeBounced$noSkip: $.Parser<$$.TypeBounced$noSkip> = $.field(
  $.pure("TypeBounced"),
  "$",
  $.right(
    $.str("bounced"),
    $.right(
      $.str("<"),
      $.field(TypeId$noSkip, "child", $.right($.str(">"), $.eps)),
    ),
  ),
);
export const $type$noSkip: $.Parser<$$.$type$noSkip> = $.alt(
  TypeOptional$noSkip,
  $.alt(TypeRegular$noSkip, $.alt(TypeMap$noSkip, TypeBounced$noSkip)),
);
export const ascription$noSkip: $.Parser<$$.ascription$noSkip> = $.right(
  $.str(":"),
  $type$noSkip,
);
export const Parameter$noSkip: $.Parser<$$.Parameter$noSkip> = $.field(
  $.pure("Parameter"),
  "$",
  $.field(Id$noSkip, "name", $.field(ascription$noSkip, "type", $.eps)),
);
export const parametersFormal$noSkip: $.Parser<$$.parametersFormal$noSkip> =
  $.right(
    $.str("("),
    $.left(
      $.opt(inter$noSkip(Parameter$noSkip, $.str(","))),
      $.left($.opt($.str(",")), $.str(")")),
    ),
  );
export const IntegerLiteralHex$noSkip: $.Parser<$$.IntegerLiteralHex$noSkip> =
  $.field(
    $.pure("IntegerLiteralHex"),
    "$",
    $.right(
      $.str("0"),
      $.right(
        $.regex<"x">("x", true),
        $.field(
          $.stry(
            $.right(
              hexDigit$noSkip,
              $.right(
                $.star(
                  $.right($.opt($.str("_")), $.right(hexDigit$noSkip, $.eps)),
                ),
                $.eps,
              ),
            ),
          ),
          "digits",
          $.eps,
        ),
      ),
    ),
  );
export const IntegerLiteralBin$noSkip: $.Parser<$$.IntegerLiteralBin$noSkip> =
  $.field(
    $.pure("IntegerLiteralBin"),
    "$",
    $.right(
      $.str("0"),
      $.right(
        $.regex<"b">("b", true),
        $.field(
          $.stry(
            $.right(
              $.regex<"0" | "1">("01", false),
              $.right(
                $.star(
                  $.right(
                    $.opt($.str("_")),
                    $.right($.regex<"0" | "1">("01", false), $.eps),
                  ),
                ),
                $.eps,
              ),
            ),
          ),
          "digits",
          $.eps,
        ),
      ),
    ),
  );
export const IntegerLiteralOct$noSkip: $.Parser<$$.IntegerLiteralOct$noSkip> =
  $.field(
    $.pure("IntegerLiteralOct"),
    "$",
    $.right(
      $.str("0"),
      $.right(
        $.regex<"o">("o", true),
        $.field(
          $.stry(
            $.right(
              $.regex<string>("0-7", false),
              $.right(
                $.star(
                  $.right(
                    $.opt($.str("_")),
                    $.right($.regex<string>("0-7", false), $.eps),
                  ),
                ),
                $.eps,
              ),
            ),
          ),
          "digits",
          $.eps,
        ),
      ),
    ),
  );
export const digit$noSkip: $.Parser<$$.digit$noSkip> = $.regex<string>(
  "0-9",
  false,
);
export const IntegerLiteralDec$noSkip: $.Parser<$$.IntegerLiteralDec$noSkip> =
  $.field(
    $.pure("IntegerLiteralDec"),
    "$",
    $.field(
      $.stry(
        $.alt(
          $.right(
            $.regex<string>("1-9", false),
            $.right(
              $.star($.right($.opt($.str("_")), $.right(digit$noSkip, $.eps))),
              $.eps,
            ),
          ),
          $.right($.str("0"), $.right($.star(digit$noSkip), $.eps)),
        ),
      ),
      "digits",
      $.eps,
    ),
  );
export const integerLiteral$noSkip: $.Parser<$$.integerLiteral$noSkip> = $.alt(
  IntegerLiteralHex$noSkip,
  $.alt(
    IntegerLiteralBin$noSkip,
    $.alt(IntegerLiteralOct$noSkip, IntegerLiteralDec$noSkip),
  ),
);
export const BoolLiteral$noSkip: $.Parser<$$.BoolLiteral$noSkip> = $.field(
  $.pure("BoolLiteral"),
  "$",
  $.field(
    $.alt($.str("true"), $.str("false")),
    "value",
    $.right($.lookNeg(idPart$noSkip), $.eps),
  ),
);
export const SuffixUnboxNotNull$noSkip: $.Parser<$$.SuffixUnboxNotNull$noSkip> =
  $.field($.pure("SuffixUnboxNotNull"), "$", $.right($.str("!!"), $.eps));
export const SuffixFieldAccess$noSkip: $.Parser<$$.SuffixFieldAccess$noSkip> =
  $.field(
    $.pure("SuffixFieldAccess"),
    "$",
    $.right($.str("."), $.field(Id$noSkip, "name", $.eps)),
  );
export const SuffixCall$noSkip: $.Parser<$$.SuffixCall$noSkip> = $.field(
  $.pure("SuffixCall"),
  "$",
  $.field(
    $.ref(() => parametersFactual$noSkip),
    "params",
    $.eps,
  ),
);
export const suffix$noSkip: $.Parser<$$.suffix$noSkip> = $.alt(
  SuffixUnboxNotNull$noSkip,
  $.alt(SuffixCall$noSkip, SuffixFieldAccess$noSkip),
);
export const parametersFactual$noSkip: $.Parser<$$.parametersFactual$noSkip> =
  $.right(
    $.str("("),
    $.left(
      $.opt(
        inter$noSkip(
          $.ref(() => expression$noSkip),
          $.str(","),
        ),
      ),
      $.left($.opt($.str(",")), $.str(")")),
    ),
  );
export const InitOf$noSkip: $.Parser<$$.InitOf$noSkip> = $.field(
  $.pure("InitOf"),
  "$",
  $.right(
    initOf$noSkip,
    $.field(
      Id$noSkip,
      "name",
      $.field(parametersFactual$noSkip, "params", $.eps),
    ),
  ),
);
export const structFieldInitializer$noSkip: $.Parser<$$.structFieldInitializer$noSkip> =
  $.field(
    Id$noSkip,
    "name",
    $.field(
      $.opt(
        $.right(
          $.str(":"),
          $.ref(() => expression$noSkip),
        ),
      ),
      "init",
      $.eps,
    ),
  );
export const StructInstance$noSkip: $.Parser<$$.StructInstance$noSkip> =
  $.field(
    $.pure("StructInstance"),
    "$",
    $.right(
      TypeId$noSkip,
      $.right(
        $.str("{"),
        $.field(
          $.opt(inter$noSkip(structFieldInitializer$noSkip, $.str(","))),
          "fields",
          $.right($.opt($.str(",")), $.right($.str("}"), $.eps)),
        ),
      ),
    ),
  );
export const parens$noSkip: $.Parser<$$.parens$noSkip> = $.right(
  $.str("("),
  $.left(
    $.ref(() => expression$noSkip),
    $.str(")"),
  ),
);
export const Parens$noSkip: $.Parser<$$.Parens$noSkip> = $.field(
  $.pure("Parens"),
  "$",
  $.right(parens$noSkip, $.eps),
);
export const primary$noSkip: $.Parser<$$.primary$noSkip> = $.alt(
  Parens$noSkip,
  $.alt(
    StructInstance$noSkip,
    $.alt(
      integerLiteral$noSkip,
      $.alt(
        BoolLiteral$noSkip,
        $.alt(
          InitOf$noSkip,
          $.alt($null$noSkip, $.alt(StringLiteral$noSkip, Id$noSkip)),
        ),
      ),
    ),
  ),
);
export const Suffix$noSkip: $.Parser<$$.Suffix$noSkip> = $.field(
  $.pure("Suffix"),
  "$",
  $.field(
    primary$noSkip,
    "expression",
    $.field($.star(suffix$noSkip), "suffixes", $.eps),
  ),
);
export const Unary$noSkip: $.Parser<$$.Unary$noSkip> = $.field(
  $.pure("Unary"),
  "$",
  $.field(
    $.star($.regex<"-" | "+" | "!" | "~">("-+!~", false)),
    "prefixes",
    $.field(Suffix$noSkip, "expression", $.eps),
  ),
);
export const Mul$noSkip: $.Parser<$$.Mul$noSkip> = $.field(
  $.pure("Mul"),
  "$",
  $.right(
    inter$noSkip(Unary$noSkip, $.regex<"*" | "/" | "%">("*/%", false)),
    $.eps,
  ),
);
export const Add$noSkip: $.Parser<$$.Add$noSkip> = $.field(
  $.pure("Add"),
  "$",
  $.right(
    inter$noSkip(
      Mul$noSkip,
      $.alt(
        $.right($.str("+"), $.right($.lookNeg($.str("+")), $.eps)),
        $.right($.str("-"), $.right($.lookNeg($.str("-")), $.eps)),
      ),
    ),
    $.eps,
  ),
);
export const BitwiseShift$noSkip: $.Parser<$$.BitwiseShift$noSkip> = $.field(
  $.pure("BitwiseShift"),
  "$",
  $.right(inter$noSkip(Add$noSkip, $.alt($.str("<<"), $.str(">>"))), $.eps),
);
export const Compare$noSkip: $.Parser<$$.Compare$noSkip> = $.field(
  $.pure("Compare"),
  "$",
  $.right(
    inter$noSkip(
      BitwiseShift$noSkip,
      $.alt($.str("<="), $.alt($.str("<"), $.alt($.str(">="), $.str(">")))),
    ),
    $.eps,
  ),
);
export const Equality$noSkip: $.Parser<$$.Equality$noSkip> = $.field(
  $.pure("Equality"),
  "$",
  $.right(inter$noSkip(Compare$noSkip, $.alt($.str("!="), $.str("=="))), $.eps),
);
export const BitwiseAnd$noSkip: $.Parser<$$.BitwiseAnd$noSkip> = $.field(
  $.pure("BitwiseAnd"),
  "$",
  $.right(inter$noSkip(Equality$noSkip, $.str("&")), $.eps),
);
export const BitwiseXor$noSkip: $.Parser<$$.BitwiseXor$noSkip> = $.field(
  $.pure("BitwiseXor"),
  "$",
  $.right(inter$noSkip(BitwiseAnd$noSkip, $.str("^")), $.eps),
);
export const BitwiseOr$noSkip: $.Parser<$$.BitwiseOr$noSkip> = $.field(
  $.pure("BitwiseOr"),
  "$",
  $.right(inter$noSkip(BitwiseXor$noSkip, $.str("|")), $.eps),
);
export const And$noSkip: $.Parser<$$.And$noSkip> = $.field(
  $.pure("And"),
  "$",
  $.right(inter$noSkip(BitwiseOr$noSkip, $.str("&&")), $.eps),
);
export const Or$noSkip: $.Parser<$$.Or$noSkip> = $.field(
  $.pure("Or"),
  "$",
  $.right(inter$noSkip(And$noSkip, $.str("||")), $.eps),
);
export const Conditional$noSkip: $.Parser<$$.Conditional$noSkip> = $.field(
  $.pure("Conditional"),
  "$",
  $.field(
    Or$noSkip,
    "head",
    $.field(
      $.star(
        $.right(
          $.str("?"),
          $.field(
            Or$noSkip,
            "thenBranch",
            $.right(
              $.str(":"),
              $.field(
                $.ref(() => Conditional$noSkip),
                "elseBranch",
                $.eps,
              ),
            ),
          ),
        ),
      ),
      "tail",
      $.eps,
    ),
  ),
);
export const expression$noSkip: $.Parser<$$.expression$noSkip> =
  Conditional$noSkip;
export const StatementLet$noSkip: $.Parser<$$.StatementLet$noSkip> = $.field(
  $.pure("StatementLet"),
  "$",
  $.right(
    $let$noSkip,
    $.field(
      Id$noSkip,
      "name",
      $.field(
        $.opt(ascription$noSkip),
        "type",
        $.right(
          $.str("="),
          $.field(
            expression$noSkip,
            "init",
            $.right($.alt($.str(";"), $.lookPos($.str("}"))), $.eps),
          ),
        ),
      ),
    ),
  ),
);
export const StatementReturn$noSkip: $.Parser<$$.StatementReturn$noSkip> =
  $.field(
    $.pure("StatementReturn"),
    "$",
    $.right(
      $return$noSkip,
      $.field(
        $.opt(expression$noSkip),
        "expression",
        $.right($.alt($.str(";"), $.lookPos($.str("}"))), $.eps),
      ),
    ),
  );
export const StatementExpression$noSkip: $.Parser<$$.StatementExpression$noSkip> =
  $.field(
    $.pure("StatementExpression"),
    "$",
    $.field(
      expression$noSkip,
      "expression",
      $.right($.alt($.str(";"), $.lookPos($.str("}"))), $.eps),
    ),
  );
export const StatementAssign$noSkip: $.Parser<$$.StatementAssign$noSkip> =
  $.field(
    $.pure("StatementAssign"),
    "$",
    $.field(
      expression$noSkip,
      "left",
      $.field(
        $.opt(
          $.regex<"-" | "+" | "*" | "/" | "%" | "|" | "&" | "^">(
            "-+*/%|&^",
            false,
          ),
        ),
        "operator",
        $.right(
          $.str("="),
          $.field(
            expression$noSkip,
            "right",
            $.right($.alt($.str(";"), $.lookPos($.str("}"))), $.eps),
          ),
        ),
      ),
    ),
  );
export const StatementForEach$noSkip: $.Parser<$$.StatementForEach$noSkip> =
  $.field(
    $.pure("StatementForEach"),
    "$",
    $.right(
      foreach$noSkip,
      $.right(
        $.str("("),
        $.field(
          Id$noSkip,
          "key",
          $.right(
            $.str(","),
            $.field(
              Id$noSkip,
              "value",
              $.right(
                $.str("in"),
                $.field(
                  expression$noSkip,
                  "expression",
                  $.right(
                    $.str(")"),
                    $.field(
                      $.ref(() => statements$noSkip),
                      "body",
                      $.eps,
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
export const StatementTry$noSkip: $.Parser<$$.StatementTry$noSkip> = $.field(
  $.pure("StatementTry"),
  "$",
  $.right(
    $try$noSkip,
    $.field(
      $.ref(() => statements$noSkip),
      "body",
      $.field(
        $.opt(
          $.right(
            $catch$noSkip,
            $.right(
              $.str("("),
              $.field(
                Id$noSkip,
                "name",
                $.right(
                  $.str(")"),
                  $.field(
                    $.ref(() => statements$noSkip),
                    "body2",
                    $.eps,
                  ),
                ),
              ),
            ),
          ),
        ),
        "handler",
        $.eps,
      ),
    ),
  ),
);
export const StatementUntil$noSkip: $.Parser<$$.StatementUntil$noSkip> =
  $.field(
    $.pure("StatementUntil"),
    "$",
    $.right(
      $do$noSkip,
      $.field(
        $.ref(() => statements$noSkip),
        "body",
        $.right(
          until$noSkip,
          $.field(
            parens$noSkip,
            "condition",
            $.right($.alt($.str(";"), $.lookPos($.str("}"))), $.eps),
          ),
        ),
      ),
    ),
  );
export const StatementRepeat$noSkip: $.Parser<$$.StatementRepeat$noSkip> =
  $.field(
    $.pure("StatementRepeat"),
    "$",
    $.right(
      repeat$noSkip,
      $.field(
        parens$noSkip,
        "condition",
        $.field(
          $.ref(() => statements$noSkip),
          "body",
          $.eps,
        ),
      ),
    ),
  );
export const StatementWhile$noSkip: $.Parser<$$.StatementWhile$noSkip> =
  $.field(
    $.pure("StatementWhile"),
    "$",
    $.right(
      $while$noSkip,
      $.field(
        parens$noSkip,
        "condition",
        $.field(
          $.ref(() => statements$noSkip),
          "body",
          $.eps,
        ),
      ),
    ),
  );
export const StatementCondition$noSkip: $.Parser<$$.StatementCondition$noSkip> =
  $.field(
    $.pure("StatementCondition"),
    "$",
    $.right(
      $if$noSkip,
      $.field(
        expression$noSkip,
        "condition",
        $.field(
          $.ref(() => statements$noSkip),
          "trueBranch",
          $.field(
            $.opt(
              $.right(
                $else$noSkip,
                $.alt(
                  $.ref(() => statements$noSkip),
                  $.ref(() => StatementCondition$noSkip),
                ),
              ),
            ),
            "falseBranch",
            $.eps,
          ),
        ),
      ),
    ),
  );
export const StatementBlock$noSkip: $.Parser<$$.StatementBlock$noSkip> =
  $.field(
    $.pure("StatementBlock"),
    "$",
    $.field(
      $.ref(() => statements$noSkip),
      "body",
      $.eps,
    ),
  );
export const statement$noSkip: $.Parser<$$.statement$noSkip> = $.alt(
  StatementLet$noSkip,
  $.alt(
    StatementBlock$noSkip,
    $.alt(
      StatementReturn$noSkip,
      $.alt(
        StatementCondition$noSkip,
        $.alt(
          StatementWhile$noSkip,
          $.alt(
            StatementRepeat$noSkip,
            $.alt(
              StatementUntil$noSkip,
              $.alt(
                StatementTry$noSkip,
                $.alt(
                  StatementForEach$noSkip,
                  $.alt(StatementExpression$noSkip, StatementAssign$noSkip),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const statements$noSkip: $.Parser<$$.statements$noSkip> = $.right(
  $.str("{"),
  $.left($.star(statement$noSkip), $.str("}")),
);
export const FunctionDefinition$noSkip: $.Parser<$$.FunctionDefinition$noSkip> =
  $.field(
    $.pure("FunctionDefinition"),
    "$",
    $.field(statements$noSkip, "body", $.eps),
  );
export const FunctionDeclaration$noSkip: $.Parser<$$.FunctionDeclaration$noSkip> =
  $.field(
    $.pure("FunctionDeclaration"),
    "$",
    $.right($.stry($.alt($.str(";"), $.lookPos($.str("}")))), $.eps),
  );
export const Function$noSkip: $.Parser<$$.Function$noSkip> = $.field(
  $.pure("Function"),
  "$",
  $.field(
    $.star(functionAttribute$noSkip),
    "attributes",
    $.right(
      fun$noSkip,
      $.field(
        Id$noSkip,
        "name",
        $.field(
          parametersFormal$noSkip,
          "parameters",
          $.field(
            $.opt(ascription$noSkip),
            "type",
            $.field(
              $.alt(FunctionDefinition$noSkip, FunctionDeclaration$noSkip),
              "body",
              $.eps,
            ),
          ),
        ),
      ),
    ),
  ),
);
export const AsmData$noSkip: $.Parser<$$.AsmData$noSkip> = $.field(
  $.pure("AsmData"),
  "$",
  $.right(
    $.right(
      $.regex<"x" | "b">("xb", true),
      $.right(
        $.str("{"),
        $.right($.star(hexDigit$noSkip), $.right($.str("}"), $.eps)),
      ),
    ),
    $.eps,
  ),
);
export const AsmAny$noSkip: $.Parser<$$.AsmAny$noSkip> = $.field(
  $.pure("AsmAny"),
  "$",
  $.right(
    $.right(
      $.lookNeg(comment$noSkip),
      $.right(
        $.plus(
          $.right(
            $.lookNeg(space$noSkip),
            $.right($.lookNeg($.str("}")), $.right($.any, $.eps)),
          ),
        ),
        $.eps,
      ),
    ),
    $.eps,
  ),
);
export const asmInstruction$noSkip: $.Parser<$$.asmInstruction$noSkip> = $.alt(
  AsmData$noSkip,
  AsmAny$noSkip,
);
export const AsmFunction$noSkip: $.Parser<$$.AsmFunction$noSkip> = $.field(
  $.pure("AsmFunction"),
  "$",
  $.right(
    $.str("asm"),
    $.field(
      $.opt(
        $.right(
          $.str("("),
          $.field(
            $.star(Id$noSkip),
            "ids",
            $.field(
              $.opt($.right($.str("->"), $.plus(IntegerLiteralDec$noSkip))),
              "to",
              $.right($.str(")"), $.eps),
            ),
          ),
        ),
      ),
      "shuffle",
      $.field(
        $.star(functionAttribute$noSkip),
        "attributes",
        $.right(
          fun$noSkip,
          $.field(
            Id$noSkip,
            "name",
            $.field(
              parametersFormal$noSkip,
              "parameters",
              $.field(
                $.opt(ascription$noSkip),
                "returnType",
                $.right(
                  $.str("{"),
                  $.field(
                    $.plus(asmInstruction$noSkip),
                    "instructions",
                    $.right($.str("}"), $.eps),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const funcQuotedId$noSkip: $.Parser<$$.funcQuotedId$noSkip> = $.right(
  $.str("`"),
  $.left(
    $.stry(
      $.plus(
        $.right(
          $.lookNeg($.regex<"`" | "\n">("`\\n", false)),
          $.right($.any, $.eps),
        ),
      ),
    ),
    $.str("`"),
  ),
);
export const notUnderscore$noSkip: $.Parser<$$.notUnderscore$noSkip> =
  $.str("_");
export const notArithOperator$noSkip: $.Parser<$$.notArithOperator$noSkip> =
  $.alt(
    $.str("+"),
    $.alt(
      $.str("-"),
      $.alt(
        $.str("*"),
        $.alt(
          $.str("/%"),
          $.alt(
            $.str("/"),
            $.alt(
              $.str("%"),
              $.alt(
                $.str("~/"),
                $.alt($.str("^/"), $.alt($.str("~%"), $.str("^%"))),
              ),
            ),
          ),
        ),
      ),
    ),
  );
export const notComparisonOperator$noSkip: $.Parser<$$.notComparisonOperator$noSkip> =
  $.alt(
    $.str("<=>"),
    $.alt(
      $.str("<="),
      $.alt(
        $.str("<"),
        $.alt($.str(">="), $.alt($.str(">"), $.alt($.str("!="), $.str("==")))),
      ),
    ),
  );
export const notBitwiseOperator$noSkip: $.Parser<$$.notBitwiseOperator$noSkip> =
  $.alt(
    $.str("~>>"),
    $.alt(
      $.str("~"),
      $.alt(
        $.str("^>>"),
        $.alt(
          $.str("^"),
          $.alt($.str("&"), $.alt($.str("|"), $.alt($.str("<<"), $.str(">>")))),
        ),
      ),
    ),
  );
export const notAssignOperator$noSkip: $.Parser<$$.notAssignOperator$noSkip> =
  $.alt(
    $.str("="),
    $.alt(
      $.str("+="),
      $.alt(
        $.str("-="),
        $.alt(
          $.str("*="),
          $.alt(
            $.str("/="),
            $.alt(
              $.str("%="),
              $.alt(
                $.str("~>>="),
                $.alt(
                  $.str("~/="),
                  $.alt(
                    $.str("~%="),
                    $.alt(
                      $.str("^>>="),
                      $.alt(
                        $.str("^/="),
                        $.alt(
                          $.str("^%="),
                          $.alt(
                            $.str("^="),
                            $.alt(
                              $.str("<<="),
                              $.alt(
                                $.str(">>="),
                                $.alt($.str("&="), $.str("|=")),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
export const notDelimiter$noSkip: $.Parser<$$.notDelimiter$noSkip> = $.alt(
  $.str("["),
  $.alt(
    $.str("]"),
    $.alt($.str("{"), $.alt($.str("}"), $.alt($.str("?"), $.str(":")))),
  ),
);
export const notControlKeyword$noSkip: $.Parser<$$.notControlKeyword$noSkip> =
  $.alt(
    $.str("return"),
    $.alt(
      $.str("var"),
      $.alt(
        $.str("repeat"),
        $.alt(
          $.str("do"),
          $.alt(
            $.str("while"),
            $.alt(
              $.str("until"),
              $.alt(
                $.str("try"),
                $.alt(
                  $.str("catch"),
                  $.alt(
                    $.str("ifnot"),
                    $.alt(
                      $.str("if"),
                      $.alt(
                        $.str("then"),
                        $.alt(
                          $.str("elseifnot"),
                          $.alt($.str("elseif"), $.str("else")),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
export const notTypeKeyword$noSkip: $.Parser<$$.notTypeKeyword$noSkip> = $.alt(
  $.str("int"),
  $.alt(
    $.str("cell"),
    $.alt(
      $.str("builder"),
      $.alt(
        $.str("slice"),
        $.alt(
          $.str("cont"),
          $.alt(
            $.str("tuple"),
            $.alt($.str("type"), $.alt($.str("->"), $.str("forall"))),
          ),
        ),
      ),
    ),
  ),
);
export const notKeyword$noSkip: $.Parser<$$.notKeyword$noSkip> = $.alt(
  $.str("extern"),
  $.alt(
    $.str("global"),
    $.alt(
      $.str("asm"),
      $.alt(
        $.str("impure"),
        $.alt(
          $.str("inline_ref"),
          $.alt(
            $.str("inline"),
            $.alt(
              $.str("auto_apply"),
              $.alt(
                $.str("method_id"),
                $.alt(
                  $.str("operator"),
                  $.alt(
                    $.str("infixl"),
                    $.alt(
                      $.str("infixr"),
                      $.alt($.str("infix"), $.str("const")),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const notDirective$noSkip: $.Parser<$$.notDirective$noSkip> = $.alt(
  $.str("#include"),
  $.str("#pragma"),
);
export const notDecimalNumber$noSkip: $.Parser<$$.notDecimalNumber$noSkip> =
  $.stry($.right($.opt($.str("-")), $.right($.plus(digit$noSkip), $.eps)));
export const notHexadecimalNumber$noSkip: $.Parser<$$.notHexadecimalNumber$noSkip> =
  $.stry(
    $.right(
      $.opt($.str("-")),
      $.right($.str("0x"), $.right($.plus(hexDigit$noSkip), $.eps)),
    ),
  );
export const funcInvalidId$noSkip: $.Parser<$$.funcInvalidId$noSkip> = $.alt(
  notUnderscore$noSkip,
  $.alt(
    notArithOperator$noSkip,
    $.alt(
      notComparisonOperator$noSkip,
      $.alt(
        notBitwiseOperator$noSkip,
        $.alt(
          notAssignOperator$noSkip,
          $.alt(
            notDelimiter$noSkip,
            $.alt(
              notControlKeyword$noSkip,
              $.alt(
                notTypeKeyword$noSkip,
                $.alt(
                  notKeyword$noSkip,
                  $.alt(
                    notDirective$noSkip,
                    $.alt(notDecimalNumber$noSkip, notHexadecimalNumber$noSkip),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const whiteSpace$noSkip: $.Parser<$$.whiteSpace$noSkip> = $.regex<
  " " | "\t" | "\r" | "\n"
>(" \\t\\r\\n", false);
export const funcPlainId$noSkip: $.Parser<$$.funcPlainId$noSkip> = $.stry(
  $.right(
    $.lookNeg($.right(funcInvalidId$noSkip, $.right($.str(")"), $.eps))),
    $.right(
      $.plus(
        $.right(
          $.lookNeg(
            $.alt(
              whiteSpace$noSkip,
              $.regex<"(" | ")" | "[" | string | "," | "." | ";" | "~">(
                "()[\\],.;~",
                false,
              ),
            ),
          ),
          $.right($.any, $.eps),
        ),
      ),
      $.eps,
    ),
  ),
);
export const funcId$noSkip: $.Parser<$$.funcId$noSkip> = $.right(
  $.lookNeg($.alt($.str('"'), $.str("{-"))),
  $.field(
    $.opt($.alt($.str("."), $.str("~"))),
    "accessor",
    $.field($.alt(funcQuotedId$noSkip, funcPlainId$noSkip), "id", $.eps),
  ),
);
export const NativeFunctionDecl$noSkip: $.Parser<$$.NativeFunctionDecl$noSkip> =
  $.field(
    $.pure("NativeFunctionDecl"),
    "$",
    $.right(
      $.str("@name"),
      $.right(
        $.str("("),
        $.field(
          funcId$noSkip,
          "nativeName",
          $.right(
            $.str(")"),
            $.field(
              $.star(functionAttribute$noSkip),
              "attributes",
              $.right(
                $native$noSkip,
                $.field(
                  Id$noSkip,
                  "name",
                  $.field(
                    parametersFormal$noSkip,
                    "parameters",
                    $.field(
                      $.opt(ascription$noSkip),
                      "returnType",
                      $.right($.str(";"), $.eps),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  );
export const ConstantDefinition$noSkip: $.Parser<$$.ConstantDefinition$noSkip> =
  $.field(
    $.pure("ConstantDefinition"),
    "$",
    $.right(
      $.str("="),
      $.field(
        expression$noSkip,
        "expression",
        $.right($.alt($.str(";"), $.lookPos($.str("}"))), $.eps),
      ),
    ),
  );
export const ConstantDeclaration$noSkip: $.Parser<$$.ConstantDeclaration$noSkip> =
  $.field(
    $.pure("ConstantDeclaration"),
    "$",
    $.right($.stry($.alt($.str(";"), $.lookPos($.str("}")))), $.eps),
  );
export const Constant$noSkip: $.Parser<$$.Constant$noSkip> = $.field(
  $.pure("Constant"),
  "$",
  $.field(
    $.star($.alt(virtual$noSkip, $.alt(override$noSkip, $abstract$noSkip))),
    "attributes",
    $.right(
      $const$noSkip,
      $.field(
        Id$noSkip,
        "name",
        $.field(
          ascription$noSkip,
          "type",
          $.field(
            $.alt(ConstantDefinition$noSkip, ConstantDeclaration$noSkip),
            "body",
            $.eps,
          ),
        ),
      ),
    ),
  ),
);
export const FieldDecl$noSkip: $.Parser<$$.FieldDecl$noSkip> = $.field(
  $.pure("FieldDecl"),
  "$",
  $.field(
    Id$noSkip,
    "name",
    $.field(
      ascription$noSkip,
      "type",
      $.field(
        $.opt($.right($as$noSkip, Id$noSkip)),
        "as",
        $.field(
          $.opt($.right($.str("="), expression$noSkip)),
          "expression",
          $.eps,
        ),
      ),
    ),
  ),
);
export const structFields$noSkip: $.Parser<$$.structFields$noSkip> = $.left(
  $.opt(inter$noSkip(FieldDecl$noSkip, $.str(";"))),
  $.opt($.str(";")),
);
export const StructDecl$noSkip: $.Parser<$$.StructDecl$noSkip> = $.field(
  $.pure("StructDecl"),
  "$",
  $.right(
    $.str("struct"),
    $.field(
      TypeId$noSkip,
      "name",
      $.right(
        $.str("{"),
        $.field(structFields$noSkip, "fields", $.right($.str("}"), $.eps)),
      ),
    ),
  ),
);
export const MessageDecl$noSkip: $.Parser<$$.MessageDecl$noSkip> = $.field(
  $.pure("MessageDecl"),
  "$",
  $.right(
    $.str("message"),
    $.field(
      $.opt($.right($.str("("), $.left(integerLiteral$noSkip, $.str(")")))),
      "id",
      $.field(
        TypeId$noSkip,
        "name",
        $.right(
          $.str("{"),
          $.field(structFields$noSkip, "fields", $.right($.str("}"), $.eps)),
        ),
      ),
    ),
  ),
);
export const ContractAttribute$noSkip: $.Parser<$$.ContractAttribute$noSkip> =
  $.field(
    $.pure("ContractAttribute"),
    "$",
    $.right(
      $.right(
        $.str("@interface"),
        $.right(
          $.str("("),
          $.right(StringLiteral$noSkip, $.right($.str(")"), $.eps)),
        ),
      ),
      $.eps,
    ),
  );
export const contract$noSkip: $.Parser<$$.contract$noSkip> = $.left(
  $.str("contract"),
  $.lookNeg(idPart$noSkip),
);
export const InheritedTraits$noSkip: $.Parser<$$.InheritedTraits$noSkip> =
  $.field(
    $.pure("InheritedTraits"),
    "$",
    $.field(
      inter$noSkip(Id$noSkip, $.str(",")),
      "ids",
      $.right($.opt($.str(",")), $.eps),
    ),
  );
export const ContractInit$noSkip: $.Parser<$$.ContractInit$noSkip> = $.field(
  $.pure("ContractInit"),
  "$",
  $.right(
    $.right(
      $.str("init"),
      $.right(parametersFormal$noSkip, $.right(statements$noSkip, $.eps)),
    ),
    $.eps,
  ),
);
export const receiverParam$noSkip: $.Parser<$$.receiverParam$noSkip> = $.opt(
  $.alt(Parameter$noSkip, StringLiteral$noSkip),
);
export const ReceiverReceive$noSkip: $.Parser<$$.ReceiverReceive$noSkip> =
  $.field(
    $.pure("ReceiverReceive"),
    "$",
    $.right(
      receive$noSkip,
      $.right(
        $.str("("),
        $.field(
          receiverParam$noSkip,
          "param",
          $.right($.str(")"), $.field(statements$noSkip, "body", $.eps)),
        ),
      ),
    ),
  );
export const ReceiverExternal$noSkip: $.Parser<$$.ReceiverExternal$noSkip> =
  $.field(
    $.pure("ReceiverExternal"),
    "$",
    $.right(
      external$noSkip,
      $.right(
        $.str("("),
        $.field(
          receiverParam$noSkip,
          "param",
          $.right($.str(")"), $.field(statements$noSkip, "body", $.eps)),
        ),
      ),
    ),
  );
export const ReceiverBounced$noSkip: $.Parser<$$.ReceiverBounced$noSkip> =
  $.field(
    $.pure("ReceiverBounced"),
    "$",
    $.right(
      $.str("bounced"),
      $.right(
        $.str("("),
        $.field(
          Parameter$noSkip,
          "param",
          $.right($.str(")"), $.field(statements$noSkip, "body", $.eps)),
        ),
      ),
    ),
  );
export const receiver$noSkip: $.Parser<$$.receiver$noSkip> = $.alt(
  ReceiverReceive$noSkip,
  $.alt(ReceiverExternal$noSkip, ReceiverBounced$noSkip),
);
export const storageVar$noSkip: $.Parser<$$.storageVar$noSkip> = $.left(
  FieldDecl$noSkip,
  $.alt($.str(";"), $.lookPos($.str("}"))),
);
export const contractItemDecl$noSkip: $.Parser<$$.contractItemDecl$noSkip> =
  $.alt(
    ContractInit$noSkip,
    $.alt(
      receiver$noSkip,
      $.alt(Function$noSkip, $.alt(Constant$noSkip, storageVar$noSkip)),
    ),
  );
export const Contract$noSkip: $.Parser<$$.Contract$noSkip> = $.field(
  $.pure("Contract"),
  "$",
  $.field(
    $.star(ContractAttribute$noSkip),
    "attributes",
    $.right(
      contract$noSkip,
      $.field(
        Id$noSkip,
        "name",
        $.field(
          $.opt($.right($with$noSkip, InheritedTraits$noSkip)),
          "traits",
          $.right(
            $.str("{"),
            $.field(
              $.star(contractItemDecl$noSkip),
              "items",
              $.right($.str("}"), $.eps),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const traitItemDecl$noSkip: $.Parser<$$.traitItemDecl$noSkip> = $.alt(
  receiver$noSkip,
  $.alt(Function$noSkip, $.alt(Constant$noSkip, storageVar$noSkip)),
);
export const Trait$noSkip: $.Parser<$$.Trait$noSkip> = $.field(
  $.pure("Trait"),
  "$",
  $.right(
    $.right(
      $.star(ContractAttribute$noSkip),
      $.right(
        trait$noSkip,
        $.right(
          Id$noSkip,
          $.right(
            $.opt(
              $.right($with$noSkip, $.right(InheritedTraits$noSkip, $.eps)),
            ),
            $.right(
              $.str("{"),
              $.right($.star(traitItemDecl$noSkip), $.right($.str("}"), $.eps)),
            ),
          ),
        ),
      ),
    ),
    $.eps,
  ),
);
export const moduleItem$noSkip: $.Parser<$$.moduleItem$noSkip> = $.alt(
  PrimitiveTypeDecl$noSkip,
  $.alt(
    Function$noSkip,
    $.alt(
      AsmFunction$noSkip,
      $.alt(
        NativeFunctionDecl$noSkip,
        $.alt(
          Constant$noSkip,
          $.alt(
            StructDecl$noSkip,
            $.alt(MessageDecl$noSkip, $.alt(Contract$noSkip, Trait$noSkip)),
          ),
        ),
      ),
    ),
  ),
);
export const Module$noSkip: $.Parser<$$.Module$noSkip> = $.field(
  $.pure("Module"),
  "$",
  $.field(
    $.star(Import$noSkip),
    "imports",
    $.field($.star(moduleItem$noSkip), "items", $.eps),
  ),
);
export const escapeChar: $.Parser<$$.escapeChar> = $.alt(
  $.left(
    $.regex<"\\" | '"' | "n" | "r" | "t" | "v" | "b" | "f">(
      '\\\\"nrtvbf',
      false,
    ),
    $.star(space$noSkip),
  ),
  $.alt(
    $.right(
      $.left($.str("u{"), $.star(space$noSkip)),
      $.left(
        $.stry(
          $.right(
            hexDigit,
            $.right(
              $.opt(hexDigit),
              $.right(
                $.opt(hexDigit),
                $.right(
                  $.opt(hexDigit),
                  $.right($.opt(hexDigit), $.right($.opt(hexDigit), $.eps)),
                ),
              ),
            ),
          ),
        ),
        $.left($.str("}"), $.star(space$noSkip)),
      ),
    ),
    $.alt(
      $.right(
        $.left($.str("u"), $.star(space$noSkip)),
        $.stry(
          $.right(
            hexDigit,
            $.right(hexDigit, $.right(hexDigit, $.right(hexDigit, $.eps))),
          ),
        ),
      ),
      $.right(
        $.left($.str("x"), $.star(space$noSkip)),
        $.stry($.right(hexDigit, $.right(hexDigit, $.eps))),
      ),
    ),
  ),
);
export const extend: $.Parser<$$.extend> = $.left(
  $.left($.str("extend"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const $public: $.Parser<$$.$public> = $.left(
  $.left($.str("public"), $.lookNeg(idPart$noSkip)),
  $.star(space$noSkip),
);
export const keyword: $.Parser<$$.keyword> = $.alt(
  fun,
  $.alt(
    $let,
    $.alt(
      $return,
      $.alt(
        receive,
        $.alt(
          extend,
          $.alt(
            $native,
            $.alt(
              primitive,
              $.alt(
                $public,
                $.alt(
                  $null,
                  $.alt(
                    $if,
                    $.alt(
                      $else,
                      $.alt(
                        $while,
                        $.alt(
                          repeat,
                          $.alt(
                            $do,
                            $.alt(
                              until,
                              $.alt(
                                $try,
                                $.alt(
                                  $catch,
                                  $.alt(
                                    foreach,
                                    $.alt(
                                      $as,
                                      $.alt(
                                        map,
                                        $.alt(
                                          mutates,
                                          $.alt(
                                            $extends,
                                            $.alt(
                                              external,
                                              $.alt(
                                                $import,
                                                $.alt(
                                                  $with,
                                                  $.alt(
                                                    trait,
                                                    $.alt(
                                                      initOf,
                                                      $.alt(
                                                        override,
                                                        $.alt(
                                                          $abstract,
                                                          $.alt(
                                                            virtual,
                                                            $.alt(
                                                              inline,
                                                              $const,
                                                            ),
                                                          ),
                                                        ),
                                                      ),
                                                    ),
                                                  ),
                                                ),
                                              ),
                                            ),
                                          ),
                                        ),
                                      ),
                                    ),
                                  ),
                                ),
                              ),
                            ),
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ),
          ),
        ),
      ),
    ),
  ),
);
export const reservedWord: $.Parser<$$.reservedWord> = $.left(
  keyword,
  $.lookNeg(idPart),
);
export const JustImports: $.Parser<$$.JustImports> = $.field(
  $.pure("JustImports"),
  "$",
  $.field(
    $.star(Import),
    "imports",
    $.right($.star($.left($.any, $.star(space$noSkip))), $.eps),
  ),
);
export const JustImports$noSkip: $.Parser<$$.JustImports$noSkip> = $.field(
  $.pure("JustImports"),
  "$",
  $.field($.star(Import$noSkip), "imports", $.right($.star($.any), $.eps)),
);
