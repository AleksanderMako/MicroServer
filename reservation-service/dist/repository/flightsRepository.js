"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
require("../cacheService/cache");
// import * as mongoose from "mongoose";
const redis = require("redis");
const util = require("util");
class FlightRepository {
    constructor(mongooseConection, Schema) {
        this.mongooseConection = mongooseConection;
        const flightSchema = Schema;
        this.Model = this.mongooseConection.model("flight", flightSchema);
        const cutil = this.cacheUtil;
        const redisUrl = "redis://redis_server:6379";
        const client = redis.createClient(redisUrl);
        client.hget = util.promisify(client.hget);
        const exec = mongoose.Query.prototype.exec;
        mongoose.Query.prototype.exec = function () {
            return __awaiter(this, arguments, void 0, function* () {
                if (cutil) {
                    console.log("fetching from mongo because cache false : " + mongoose.Collection.name);
                    return exec.apply(this, arguments);
                }
                const redisKey = Object.assign({}, this.getQuery(), {
                    collection: mongoose.Collection.name
                });
                const stringKey = JSON.stringify(redisKey);
                // check in cache
                const chached_data = yield client.hget(stringKey);
                // if yes then return that
                if (chached_data) {
                    console.log("fetching from cache :" + mongoose.Collection.name);
                    const doc = JSON.parse(chached_data);
                    return Array.isArray(doc)
                        ? doc.map(d => mongoose.model(d)) // hydrate the array
                        : mongoose.model(doc);
                }
                // else issue query and store res in redis
                const result = yield exec.apply(this, arguments); // execute the original function of mongoose
                client.hset(stringKey, JSON.stringify(result));
                return result;
            });
        };
    }
    setModel(model) {
        this.Model = model;
    }
    create(data) {
        const flight = new this.Model({
            flightNumber: data.flightNumber,
            departure: data.departure,
            destination: data.destination,
            airplaneType: data.airplaneType,
            capacity: data.capacity
        });
        return new Promise((resolve, reject) => {
            flight.save((err) => {
                if (err) {
                    console.log("ERROR:" + err);
                    reject(err);
                }
                else {
                    resolve();
                    console.log("INFO:Success");
                }
            });
        });
    }
    readAll() {
        //  setCacheutil.setCacheutil(true);
        this.cacheUtil = true;
        return new Promise((resolve, reject) => {
            this.Model.find({}, (err, users) => {
                if (err) {
                    reject(err);
                }
                else {
                    resolve(users);
                }
            });
        });
    }
}
exports.default = FlightRepository;
//# sourceMappingURL=flightsRepository.js.map