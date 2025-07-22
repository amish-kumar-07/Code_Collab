import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';

const server = http.createServer();
const wss = new WebSocketServer({ server });

// Store: roomId => [{ id, socket }]
const UserRoom = new Map<string, { id: string, socket: WebSocket }[]>();

wss.on('connection', (socket: WebSocket) => {
  socket.on('message', (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("User message:", message);

      if (message.type === "join") {
        const { roomId, randomId } = message;

        const users = UserRoom.get(roomId) || [];

        // Check if user is already in room
        const alreadyJoined = users.some(u => u.id === randomId);
        if (alreadyJoined) {
          socket.send(JSON.stringify({
            type: "alert",
            message: "You have already joined this room."
          }));
          return;
        }

        // Check if room has space
        if (users.length >= 2) {
          socket.send(JSON.stringify({
            type: "alert",
            message: "Room is full. Only 2 participants are allowed."
          }));
          return;
        }

        // Add user to room
        users.push({ id: randomId, socket });
        UserRoom.set(roomId, users);

        socket.send(JSON.stringify({
          type: "success",
          message: users.length === 1 ? "Room is created and joined" : "Joined room successfully"
        }));

        console.log(`User ${randomId} joined room: ${roomId}`);
      }
    } catch (err) {
      console.error("Failed to process message:", err);
    }
  });

  socket.on('close', () => {
    for (const [roomId, users] of UserRoom.entries()) {
      const updated = users.filter(u => u.socket !== socket);
      if (updated.length === 0) {
        UserRoom.delete(roomId);
      } else {
        UserRoom.set(roomId, updated);
      }
    }
  });
});

server.listen(8080, () => {
  console.log("WebSocket server is running on ws://localhost:8080");
});
