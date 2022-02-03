import React, { useState } from "react";
import { Box, Button, Paper, TextField } from "@mui/material";

export const LoginScreen = ({
	onLogin
}: {
	onLogin: (username: string) => void;
}) => {
	const [username, setUsername] = useState<string>("");
	const loginDisabled = (username.trim() === '');
	return (
		<Paper>
			<Box display="flex" p={2}>
				<TextField
					label="username"
					value={username}
					size="small"
					sx={{marginRight:1}}
					onChange={(event) => setUsername(event.target.value)}
					onKeyPress={(event) => (!loginDisabled && (event.key === "Enter")) ? onLogin(username) : null}
				/>
				<Button variant="contained" disabled={loginDisabled} onClick={() => onLogin(username)}>
					LOGIN
				</Button>
			</Box>
		</Paper>
	);
};

export default LoginScreen;
