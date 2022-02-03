import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Box } from "@mui/material";
import { LoginScreen } from "./LoginScreen";

type Screen = "login" | "chatroom";

const App = () => {
	const [ws, setWS] = useState<WebSocket>(undefined);
	const [screen, setScreen] = useState<Screen>("login");
	const [username, setUsername] = useState<string>("");

	const connectWebSocket = () => {
		const ws = new WebSocket("ws://localhost:42069/");
		ws.onmessage = (ev) => alert(ev.data);
		setWS(ws);
	};

	const handleLogin = (username: string) => {
		setUsername(username);
		setScreen("chatroom");
	};

	const ScreenContent = () => {
		switch (screen) {
			case "login": return <LoginScreen onLogin={handleLogin} />;
			case "chatroom": return <Box><Box>TODO: implement this</Box><Box>Username: {username}</Box></Box>
		}
	};

	useEffect(() => connectWebSocket(), []);

	return (
		<Box display="flex" alignItems="center" justifyContent="center" height="100vh">
			<ScreenContent />
		</Box>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
