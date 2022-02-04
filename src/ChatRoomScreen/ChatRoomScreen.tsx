import React, { useState }  from "react";
import { Box, Container, Grid, Paper } from "@mui/material";

interface GridTileProps {
	item?: boolean;
	xs: number;
	children?: JSX.Element | string;
	paper?: boolean;
	height?: string;
}

const GridTile = (props: GridTileProps) => {
	const children = <Box p={2} height={props?.height}>{props?.children}</Box>;
	return (
		<Grid item={props?.item} xs={props?.xs}>
			{props?.paper ? <Paper>{children}</Paper> : children}
		</Grid>
	)
};

export const ChatRoomScreen = ({
	username,
}: {
	username: string;
}) => {
	const [currentRoom, setCurrentRoom] = useState<string>("TODO: current room");

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
				<GridTile item xs={6}>TODO: chat input</GridTile>
				<GridTile item xs={3}></GridTile>
			</Grid>
		</Container>
	);
};

export default ChatRoomScreen;
