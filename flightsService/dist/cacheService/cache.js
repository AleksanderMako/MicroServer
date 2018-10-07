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
const redis = require("redis");
const util = require("util");
// import CacheUtils from "./CacheUtil";
const redisUrl = "redis://redis_server:6379";
const client = redis.createClient(redisUrl);
client.hget = util.promisify(client.hget);
const exec = mongoose.Query.prototype.exec;
let cacheUtil;
exports.setCacheutil = function (cache) {
    cacheUtil = cache;
    console.log("Caching is activated and status is set ");
};
mongoose.Query.prototype.exec = function () {
    return __awaiter(this, arguments, void 0, function* () {
        if (!cacheUtil) {
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
//# sourceMappingURL=cache.js.map