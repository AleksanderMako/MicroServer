

export default class ModelStrategy {


    private strategy: any;

    constructor() {

    }

    public setStrategy(strategy: any) {

        this.strategy = strategy;
    }
    public initReposiory() {

        this.strategy.setModel();
    }
}