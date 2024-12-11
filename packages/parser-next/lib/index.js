"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
__exportStar(require("./grammar"), exports);
const $ = __importStar(require("@langtools/runtime"));
const G = __importStar(require("./grammar"));
const util_1 = require("util");
const log = (obj) => console.log((0, util_1.inspect)(obj, { colors: true, depth: Infinity }));
// npm run generate -w @langtools/parser-next && npx prettier packages/parser-next/grammar.ts --write && ts-node packages/parser-next/index.ts
const code = `
struct Transfer {
    seqno: Int as uint32;
    mode: Int as uint8;
    to: Address;
    amount: Int as coins;
    body: Cell?;
}

message(123) TransferMessage {
    signature: Slice;
    transfer: Transfer;
}

contract Wallet {

    seqno: Int as uint32 = 0;
    key: Int as uint256;
    walletId: Int as uint64;

    init(key: Int, walletId: Int) {
        self.key = key;
        self.walletId = walletId;
    }

    receive("Deploy") {
        // Do nothing
    }

    receive(msg: TransferMessage) {

        // Check Signature
        let op_hash: Int = msg.transfer.toCell().hash();
        require(checkSignature(op_hash, msg.signature, self.key), "Invalid signature");
        require(msg.transfer.seqno == self.seqno, "Invalid seqno");

        // Increment seqno
        self.seqno = self.seqno + 1;

        // Send message
        send(SendParameters{value: msg.transfer.amount, to: msg.transfer.to, mode: msg.transfer.mode, body: msg.transfer.body});
    }

    receive(msg: Slice) {
        self.seqno = self.seqno + 1;
    }

    receive() {
        self.seqno = self.seqno + 1;
    }

    receive("notify") {
        self.seqno = self.seqno + 1;
    }

    receive("你好ж") {
        self.seqno = self.seqno + 1;
    }

    receive("duplicate") {
        // Create new wallet
        let walletInit: StateInit = initOf Wallet(self.key, self.walletId + 1);
    }

    bounced(msg: Slice) {
        // TODO: Handle
    }

    get fun publicKey(): Int {
        return self.key;
    }

    get fun walletId(): Int {
        return self.walletId;
    }

    get fun seqno(): Int {
        return self.seqno;
    }
}
`;
const ast = $.parse($.left($.right($.star(G.space$noSkip), G.Module), $.eof), code);
log(ast);
