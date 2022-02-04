import React, { useEffect, useRef, useState }  from "react";
import { Box, Container, Grid, Paper } from "@mui/material";
import { ChatInput } from "./ChatInput";
import { ChatLog } from "./ChatLog";
import { ChatMessage } from "../common";

const PaperGrid = ({
	item,
	xs,
	children,
}: {
	xs: number;
	item?: boolean;
	children?: JSX.Element | string;
}) => (
	<Grid item={item} xs={xs}>
		<Paper>
			<Box height="60vh" overflow="hidden scroll">
				{children}
			</Box>
		</Paper>
	</Grid>
);

export const ChatRoomScreen = ({
	ws,
	username,
}: {
	ws: WebSocket;
	username: string;
}) => {
	const [currentRoom, setCurrentRoom] = useState<string>("TODO: current room");
	const [chatLog, setChatLog] = useState<Map<string, string[]>>(undefined);

	const chatLogRef = useRef<Map<string, string[]>>(chatLog);
	useEffect(() => {chatLogRef.current = chatLog}, [chatLog]);

	const sendMessage = (text: string) => ws.send(JSON.stringify({
		action: "message",
		topic: currentRoom,
		data: { text: text },
	}));

	const handleChatInputSend = (text: string) => sendMessage(text);

	const handleMessage = (ev: MessageEvent<any>) => {
		const chatLog = chatLogRef.current;
		const msg = JSON.parse(ev.data) as ChatMessage;
		if (msg.action === "message") {
			if (chatLog && !chatLog.has(msg?.topic)) chatLog.set(msg?.topic, []);
			chatLog?.get(msg?.topic)?.push(`[${msg.data.date}] ${msg.data.user}: ${msg.data.text}`);
			setChatLog(new Map<string, string[]>(chatLog));
		}
	};

	useEffect(() => {
		setChatLog(new Map<string, string[]>());
		const onmessage_original = ws.onmessage;
		ws.send(JSON.stringify({action:"subscribe",topic:"TODO: current room"}));
		ws.onmessage = handleMessage;
		return () => {ws.onmessage = onmessage_original};
	}, []);

	return (
		<Container>
			<Grid container justifyContent="center" spacing={2}>
				<Grid item xs={3}></Grid>
				<Grid item xs={6}>{currentRoom}</Grid>
				<Grid item xs={3}></Grid>
				<PaperGrid item xs={3}>TODO: room list</PaperGrid>
				<PaperGrid item xs={6}><ChatLog log={chatLog?.get(currentRoom)} /></PaperGrid>
				<PaperGrid item xs={3}>TODO: user list</PaperGrid>
				<Grid item xs={3}></Grid>
				<Grid item xs={6}><ChatInput onSend={handleChatInputSend} /></Grid>
				<Grid item xs={3}></Grid>
			</Grid>
		</Container>
	);
};

export default ChatRoomScreen;
