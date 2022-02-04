import React from "react";
import { Box } from "@mui/material";

export const ChatLog = ({
	log,
}: {
	log: string[];
}) => {
	return (
		<Box p={2} sx={{wordBreak:"break-word"}}>
			{log?.map((value, index) => <Box key={index} marginBottom={1}>{value}</Box>)}
		</Box>
	);
};

export default ChatLog;
