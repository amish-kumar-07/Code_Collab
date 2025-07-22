"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const express_1 = __importDefault(require("express"));
const endpoint_1 = __importDefault(require("./routes/endpoint"));
const app = (0, express_1.default)();
const wss = new ws_1.WebSocketServer({ port: 8080 });
let Users = [];
let UserRoom = new Map();
let socketCount = 0;
app.use(express_1.default.json());
app.use('/', endpoint_1.default);
wss.on("connection", (socket) => {
    socketCount++;
    console.log("User Connected:", socketCount);
    socket.on("message", (data) => {
        const message = data.toString(); // Convert Buffer to string
        console.log("User message:", message);
    });
});
app.listen(3001, () => {
    console.log("Server is running on port 3001");
});
