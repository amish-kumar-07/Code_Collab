import WebSocket, { WebSocketServer } from 'ws';
import express from 'express';

const app = express();
const wss = new WebSocketServer({ port: 8080 });

let Users: WebSocket[] = [];
let UserRoom = new Map<string, WebSocket[]>();
let socketCount = 0;

wss.on("connection", (socket) => {
    socketCount++;
    console.log("User Connected:", socketCount);

    socket.on("message", (data) => {
        const message = data.toString(); // Convert Buffer to string
        console.log("User message:", message);
    });
});


app.listen(3001,()=>{
    console.log("Server is running on port 3001");
})