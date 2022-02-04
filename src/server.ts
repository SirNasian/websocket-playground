import express from "express";
import { WebSocketServer, WebSocket } from "ws";
import { Message, SubscriptionMessage, RegistrationMessage, ChatMessage, AnyMessage } from "./common";

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
	const sendMessage = (msg: AnyMessage, ws: WebSocket = socket) => ws.send(JSON.stringify(msg));
	// Handle message
	socket.on("message", (data: Message) => {
		const msg_base = JSON.parse(data.toString()) as Message;
		const msg_sub  = msg_base as SubscriptionMessage;
		const msg_reg  = msg_base as RegistrationMessage;
		const msg_chat = msg_base as ChatMessage;
		if (!subscription_map.has(msg_sub.topic)) subscription_map.set(msg_sub.topic, []);
		const subscription_list = subscription_map.get(msg_sub?.topic);
		switch (msg_base.action) {
			case "subscribe":
				if (!subscription_list.includes(socket))
					subscription_list.push(socket);
				break;
			case "unsubscribe":
				subscription_list.splice(subscription_list.indexOf(socket), 1);
				break;
			case "register":
				if (Array.from(username_map.values()).includes(msg_reg.username)) {
					sendMessage({...msg_reg, success: false});
				} else {
					sendMessage({...msg_reg, success: true});
					username_map.set(socket, msg_reg.username);
				} break;
			case "message":
				subscription_list.forEach((ws: WebSocket) => sendMessage({
					...msg_chat,
					data: {
						date: (new Date()).toISOString(),
						user: username_map.get(socket),
						text: msg_chat.data.text,
					},
				}, ws));
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
