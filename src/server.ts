import express from "express";
import { Server } from "socket.io";

const server_web_port  =  3000;
const server_sock_port = 42069;

const server_web = express();
server_web.use(express.static("public"));
server_web.listen(server_web_port);

const server_sock = new Server(server_sock_port, { cors: { origin: "*" } });
server_sock.of(/^\/.*$/).on("connection", (socket) => {
	socket.on("message", (msg: { room: string; data: string }) => server_sock.of(socket.nsp.name).to(msg.room).emit("message", msg));
	socket.on("join", (room => socket.join(room)));
	socket.on("leave", (room => socket.leave(room)));

});

console.log(`HTTP server running on port ${server_web_port}`);
console.log(`WebSocket server running on port ${server_sock_port}`)
