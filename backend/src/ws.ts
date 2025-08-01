import { WebSocketServer, WebSocket } from 'ws';
import http from 'http';
// ws.ts
import { getQuestion } from "./wshandler/question"; // ✅

const server = http.createServer();
const wss = new WebSocketServer({ server });

const UserRoom = new Map<string, { id: string, socket: WebSocket }[]>();

wss.on('connection', (socket: WebSocket) => {
  socket.on('message', async (data) => {
    try {
      const message = JSON.parse(data.toString());
      console.log("User message:", message);

      if (message.type === "join") {
        const { roomId, randomId } = message;

        const users = UserRoom.get(roomId) || [];

        // Check if user is already in room
        const alreadyJoined = users.some(user => user.id === randomId || user.socket === socket);

        if (alreadyJoined) {
          socket.send(JSON.stringify({
            type: "alert",
            message: "You have already joined this room."
          }));
          return;
        }

        // Check if room is full BEFORE checking if room has 2 users
        if (users.length >= 2) {
          socket.send(JSON.stringify({
            type: "alert",
            message: "Room is full. Only 2 participants are allowed."
          }));
          return;
        }

        // Add user to room first
        users.push({ id: randomId, socket });
        UserRoom.set(roomId, users);

        // Send success message
        socket.send(JSON.stringify({
          type: "success",
          message: users.length === 1 ? "Room is created and joined" : "Joined room successfully"
        }));

        console.log(`User ${randomId} joined room: ${roomId}`);

        // If room now has 2 users, send question to both users
        if (users.length === 2) {
          try {
            // 🔥 FIX: Use roomId instead of randomId to get the same question for both users
            const question = await getQuestion(roomId);
                        
            // Send question to both users in the room
            users.forEach(user => {
              if (user.socket.readyState === WebSocket.OPEN) {
                user.socket.send(JSON.stringify({
                  type: "question",
                  message: question
                }));
              }
            });
          } catch (error) {
            console.error("Failed to get question:", error);
            // Notify users about the error
            users.forEach(user => {
              if (user.socket.readyState === WebSocket.OPEN) {
                user.socket.send(JSON.stringify({
                  type: "alert",
                  message: "Failed to load question. Please try again."
                }));
              }
            });
          }
        }
      }
    } catch (err) {
      console.error("Failed to process message:", err);
      socket.send(JSON.stringify({
        type: "alert",
        message: "Invalid message format"
      }));
    }
  });

  socket.on('close', () => {
    // Remove user from all rooms and clean up
    for (const [roomId, users] of UserRoom.entries()) {
      const updated = users.filter(u => u.socket !== socket);
      if (updated.length === 0) {
        UserRoom.delete(roomId);
        console.log(`Room ${roomId} deleted - no users remaining`);
      } else {
        UserRoom.set(roomId, updated);
        console.log(`User left room ${roomId}, ${updated.length} users remaining`);
                
        // Notify remaining users
        updated.forEach(user => {
          if (user.socket.readyState === WebSocket.OPEN) {
            user.socket.send(JSON.stringify({
              type: "alert",
              message: "Another user has left the room"
            }));
          }
        });
      }
    }
  });

  socket.on('error', (error) => {
    console.error('WebSocket error:', error);
  });
});

server.listen(8080, () => {
  console.log("WebSocket server is running on ws://localhost:8080");
});