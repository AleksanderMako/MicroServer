import { Server } from "./server";

const start = function () {
    const server = new Server();

    server.startListening();
};

start () ;