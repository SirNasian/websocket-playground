import React from "react";
import { Box, Typography } from "@mui/material";

export interface ChatRecord {
	date: Date;
	user: string;
	text: string;
};

export const ChatLog = ({
	log,
}: {
	log: ChatRecord[];
}) => {
	const formatDate = (date: Date) => {
		const pad = (value: number) => (value < 10) ? `0${value}` : `${value}`;
		return `${pad(date.getHours())}:${pad(date.getMinutes())}`;
	}
	return (
		<Box p={2} sx={{wordBreak:"break-word"}}>
			{log?.map((record) => (
				<Box key={JSON.stringify(record)} marginBottom={1}>
					<i style={{background:"blue",padding:"0px 6px"}}>{formatDate(record.date)}</i> <b>{record.user}</b>: {record.text}
				</Box>
			))}
		</Box>
	);
};

export default ChatLog;
