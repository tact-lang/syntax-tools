"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.singleton = void 0;
// TS bug
const singleton = (key, value) => ({ [key]: value });
exports.singleton = singleton;
