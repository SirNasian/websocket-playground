import { io, Socket } from "socket.io-client";
import React, { useEffect, useRef, useState } from "react";
import ReactDOM from "react-dom";

interface Message {
	room: string;
	data: string;
};

const App = () => {
	const [socket, setSocket] = useState<Socket>(undefined);
	const [currentNamespace, setCurrentNamespace] = useState<string>("default");
	const [namespaceText, setNamespaceText] = useState<string>("default");
	const [roomText, setRoomText] = useState<string>("");
	const [messageText, setMessageText] = useState<string>("");
	const [roomList, setRoomList] = useState<string[]>([]);
	const [messageList, setMessageList] = useState<Message[]>([]);
	const messageListRef = useRef<Message[]>(messageList);

	const connectNamespace = (namespaceName: string) => {
		socket?.disconnect();
		const s = io(`ws://localhost:42069/${namespaceName}`, { transports: ["websocket"] });
		s.on("message", (msg: Message) => setMessageList([...messageListRef.current, msg]));
		setSocket(s);
		setCurrentNamespace(namespaceName);
		setRoomList([]);
	};

	const handleJoinRoom = () => {
		if (!roomList.find(room => room === roomText)) {
			socket.emit("join", roomText);
			setRoomList([...roomList, roomText]);
		}
	};

	const handleLeaveRoom = () => {
		const index = roomList.indexOf(roomText);
		if (index >= 0) {
			socket.emit("leave", roomText);
			setRoomList(roomList.filter(room => room !== roomText));
		}
	};

	const handleNamespaceConnect = () => connectNamespace(namespaceText);
	const handleMessage = () => socket.send({ room: roomText, data: messageText });

	useEffect(() => handleNamespaceConnect(), []);
	useEffect(() => { messageListRef.current = messageList }, [messageList]);

	return (
		<React.Fragment>
			<div>
				<input type="text" value={namespaceText} onChange={(event) => setNamespaceText(event.target.value)} />
				<button type="button" onClick={handleNamespaceConnect}>connect</button>
			</div>
			<div>
				<input type="text" value={roomText} onChange={(event) => setRoomText(event.target.value)} />
				<button type="button" onClick={handleJoinRoom}>join room</button>
				<button type="button" onClick={handleLeaveRoom}>leave room</button>
			</div>
			<div>
				<input type="text" value={messageText} onChange={(event) => setMessageText(event.target.value)} />
				<button type="button" onClick={handleMessage}>send message</button>
			</div>
			<br />
			<div>
				<b>
					<div>{`Current Namespace: "${currentNamespace}"`}</div>
					<div>{`Current Rooms: ${roomList.map(room => `"${room}"`).join(", ")}`}</div>
				</b>
			</div>
			<br />
			{messageList.map((msg, index) => <div key={index}>{`${msg.room}: ${msg.data}`}</div>)}
		</React.Fragment>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
