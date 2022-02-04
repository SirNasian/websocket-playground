import React, { useState } from "react";
import { Box, Button, TextField } from "@mui/material";

export const ChatInput = ({
	onSend,
}: {
	onSend: (text: string) => void;
}) => {
	const [text, setText] = useState<string>("");
	const sendDisabled = text === "";
	const handleSend = () => { onSend(text); setText(""); };
	return (
		<Box display="flex">
			<TextField
				value={text}
				size="small"
				sx={{marginRight:1}}
				onChange={(event) => setText(event.target.value)}
				onKeyPress={(event) => ((event.key === "Enter") && !sendDisabled) ? handleSend() : null}
				fullWidth
			/>
			<Button variant="outlined" onClick={handleSend} disabled={sendDisabled}>
				SEND
			</Button>
		</Box>
	);
};

export default ChatInput;
