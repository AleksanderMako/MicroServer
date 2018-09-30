import { Server } from "./server";
const EventEmitter = require("events");
const start = function () {
    const server = new Server();

    server.startListening();
    const emitter = new EventEmitter();
    emitter.setMaxListeners(30);

};

start () ;