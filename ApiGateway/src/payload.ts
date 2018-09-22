export default class Payload {

    public functionName: string;
    private args: any;
    public static getPayload(fn: string, args: any) {
        return new Payload(fn, args);
    }
    constructor(fn: string, args: any) {
        this.functionName = fn;
        this.args = args;
    }

    public getFucnName() {

        return this.functionName;
    }
    public getArguments() {

        return this.args;
    }
}