"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Payload {
    static getPayload(fn, args) {
        return new Payload(fn, args);
    }
    constructor(fn, args) {
        this.functionName = fn;
        this.args = args;
    }
    getFucnName() {
        return this.functionName;
    }
    getArguments() {
        return this.args;
    }
}
exports.default = Payload;
//# sourceMappingURL=payload.js.map