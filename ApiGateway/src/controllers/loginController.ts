import { Request, Response, NextFunction, json, Router } from "express";
import KafkaManager from "../kafkaSoftware/kafkaservices/kafkaManager";
import { TestProducer } from "../kafkaSoftware/producer";
import { TestConsumer } from "../kafkaSoftware/consumer";
import Payload from "../payload";
import * as passport from "passport";
import * as passportjwt from "passport-jwt";
import * as jwt from "jsonwebtoken";
import LoginResponseDTO from "../api-response-DTOS/login.responseDTO";
import * as cors from "cors";
import * as bcrypt from "bcrypt";
export class LoginController {
    private KafkaManager: KafkaManager;
    private consumer: any;
    private loginControllerObject: Router;
    constructor() {
        this.KafkaManager = new KafkaManager();
        this.KafkaManager.setProducer(new TestProducer());
        this.KafkaManager.setConsumer(new TestConsumer());
        this.consumer = this.KafkaManager.createConsumerObject("userCrudResponce", "loginConsumer-1", "loginConsumergroup-1");
        this.initLoginRoute();
    }
    private initLoginRoute() {
        this.loginControllerObject = Router();
        this.loginControllerObject.use(function (req: Request, res: Response, next: any) {
            res.setHeader("Access-Control-Allow-Origin", "http://localhost:4200");
            res.setHeader("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Authorization, Accept");
            next();
        });
        this.loginControllerObject.post("/user", cors(), async (req: Request, res: Response) => {
            const payload = req.body;
            if (!req.body) {
                res.status(400).send("empty payload !!");
            }
            const kafkaPayload = Payload.getPayload(payload.functionName, payload.args);
            await this.KafkaManager.publishMessage("userCrud", kafkaPayload);
            await this.KafkaManager.startConsumer(this.consumer);
            const operationStatus = this.KafkaManager.getMessage();
            console.log(operationStatus.successStatus);

            const authenticatedUser = JSON.parse(operationStatus.successStatus);
            console.log(authenticatedUser);
            if (authenticatedUser.data === null ) {
                const failLoginDTO: LoginResponseDTO = {
                    status: "Not logged  In",
                    token: "",
                    username: "not truthy",
                    hasError: true,
                    error: "user not found",
                    typeOfUser: null
                };
                return res.send(failLoginDTO);

            }
            const result = bcrypt.compareSync(payload.args.password + authenticatedUser.data.salt, authenticatedUser.data.password);

            console.log("pass authentication  " + result);
            if (!result) {
                const failLoginDTO: LoginResponseDTO = {
                    status: "Not logged  In",
                    token: "",
                    username: authenticatedUser.data.username,
                    hasError: true,
                    error: "user not found",
                    typeOfUser: null
                };
                res.status(401);
                return res.send(failLoginDTO);
            } else {
                const token = jwt.sign({ args: { username: authenticatedUser.data.username } }, "process.env.SECRET");

                const successResponse: LoginResponseDTO = {
                    status: "logged In",
                    token: token,
                    username: authenticatedUser.data.username,
                    hasError: false,
                    error: null,
                    typeOfUser: authenticatedUser.data.typeOfUser
                };
                return res.json(successResponse);
            }
        });

    }
    public getRouter() {
        return this.loginControllerObject;
    }
}