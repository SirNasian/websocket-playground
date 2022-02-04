import React, { useState, useEffect }  from "react";
import { Box, Container, Grid, Paper } from "@mui/material";
import { ChatInput } from "./ChatInput";
import { Message } from "../common";

interface GridTileProps {
	item?: boolean;
	xs: number;
	children?: JSX.Element | string;
	paper?: boolean;
	height?: string;
}

const GridTile = (props: GridTileProps) => {
	const children = <Box height={props?.height}>{props?.children}</Box>;
	return (
		<Grid item={props?.item} xs={props?.xs}>
			{props?.paper ? <Paper>{children}</Paper> : children}
		</Grid>
	)
};

export const ChatRoomScreen = ({
	ws,
	username,
}: {
	ws: WebSocket;
	username: string;
}) => {
	const [currentRoom, setCurrentRoom] = useState<string>("TODO: current room");

	const sendMessage = (text: string) => ws.send(JSON.stringify({
		action: "message",
		topic: currentRoom,
		data: text,
	}));

	const handleChatInputSend = (text: string) => sendMessage(text);

	const handleMessage = (ev: MessageEvent<any>) => {
		const msg: Message = JSON.parse(ev.data);
		if (msg.action === "message") console.log(msg);
	};

	useEffect(() => {
		const onmessage_original = ws.onmessage;
		ws.send(JSON.stringify({action:"subscribe",topic:"TODO: current room"}));
		ws.onmessage = handleMessage;
		return () => { ws.onmessage = onmessage_original; };
	}, []);

	return (
		<Container>
			<Grid container justifyContent="center" spacing={1}>
				<GridTile item xs={3}></GridTile>
				<GridTile item xs={6}>{currentRoom}</GridTile>
				<GridTile item xs={3}></GridTile>
				<GridTile item xs={3} paper height="60vh">TODO: room list</GridTile>
				<GridTile item xs={6} paper height="60vh">TODO: chat log</GridTile>
				<GridTile item xs={3} paper height="60vh">TODO: user list</GridTile>
				<GridTile item xs={3}></GridTile>
				<GridTile item xs={6}><ChatInput onSend={handleChatInputSend} /></GridTile>
				<GridTile item xs={3}></GridTile>
			</Grid>
		</Container>
	);
};

export default ChatRoomScreen;
