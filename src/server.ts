import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Message } from "./common";

const server_web_port  =  3000;
const server_sock_port = 42069;

const server_web = express();
server_web.use(express.static("public"));
server_web.listen(server_web_port);

const server_sock      = new WebSocketServer({ port: server_sock_port });
const subscription_map = new Map<string, WebSocket[]>();
const heartbeat_map    = new Map<WebSocket, NodeJS.Timeout>();
const username_map     = new Map<WebSocket, string>();
server_sock.on("connection", (socket) => {
	const sendMessage = (msg: Message) => socket.send(JSON.stringify(msg));
	// Handle message
	socket.on("message", (data: Message) => {
		const message: Message = JSON.parse(data.toString());
		if (!subscription_map.has(message?.topic)) subscription_map.set(message?.topic, []);
		const subscription_list = subscription_map.get(message?.topic);
		switch (message.action) {
			case "subscribe":
				if (!subscription_list.find(sub => sub === socket))
					subscription_list.push(socket);
				break;
			case "unsubscribe":
				subscription_list.splice(subscription_list.indexOf(socket), 1);
				break;
			case "register":
				if (Array.from(username_map.values()).includes(message?.data)) {
					sendMessage({ action: "register", data: "failure" });
				} else {
					sendMessage({ action: "register", data: "success" });
					username_map.set(socket, message?.data);
				} break;
			case "message":
				subscription_list.forEach((socket: WebSocket) => socket.send(message?.data));
				break;
		};
	});
	// Handle connection end
	socket.on("close", () => username_map.delete(socket));
	// Heartbeat
	socket.on("pong", () => clearTimeout(heartbeat_map.get(socket)));
	setInterval(() => {
		heartbeat_map.set(socket, setTimeout(() => socket.terminate(), 5000));
		socket.ping();
	}, 2000)
});

console.log(`HTTP server running on port ${server_web_port}`);
console.log(`WebSocket server running on port ${server_sock_port}`)
