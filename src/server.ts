import express from "express";
import { WebSocketServer, WebSocket } from "ws";

const server_web_port  =  3000;
const server_sock_port = 42069;

const server_web = express();
server_web.use(express.static("public"));
server_web.listen(server_web_port);

interface Message {
	action: "subscribe" | "unsubscribe" | "message";
	topic: string;
	data?: string;
};

const server_sock = new WebSocketServer({ port: server_sock_port });
const subscription_map = new Map<string, WebSocket[]>();
const heartbeat_map = new Map<WebSocket, NodeJS.Timeout>();
server_sock.on("connection", (socket) => {
	// Handle message
	socket.on("message", (data: Message) => {
		const message: Message = JSON.parse(data.toString());
		if (!subscription_map.has(message.topic)) subscription_map.set(message.topic, []);
		const subscription_list = subscription_map.get(message.topic);
		switch (message.action) {
			case "subscribe":
				if (!subscription_list.find(sub => sub === socket))
					subscription_list.push(socket);
				break;
			case "unsubscribe":
				subscription_list.splice(subscription_list.indexOf(socket), 1);
				break;
			case "message":
				subscription_list.forEach((socket: WebSocket) => socket.send(message?.data));
				break;
		};
	});
	// Heartbeat
	socket.on("pong", () => clearTimeout(heartbeat_map.get(socket)));
	setInterval(() => {
		heartbeat_map.set(socket, setTimeout(() => socket.terminate(), 5000));
		socket.ping();
	}, 2000)
});

console.log(`HTTP server running on port ${server_web_port}`);
console.log(`WebSocket server running on port ${server_sock_port}`)
