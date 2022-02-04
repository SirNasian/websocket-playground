import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { RegistrationMessage, AnyMessage} from "./common";
import { LoginScreen } from "./LoginScreen";
import { ChatRoomScreen } from "./ChatRoomScreen";

type Screen = "login" | "chatroom";

const theme = createTheme({
	palette: {
		mode: "dark"
	}
});

const rootStyle      = document.getElementById("root").style;
rootStyle.background = theme.palette.background.default;
rootStyle.color      = theme.palette.text.primary;

const App = () => {
	const [ws, setWS] = useState<WebSocket>(undefined);
	const [screen, setScreen] = useState<Screen>("login");
	const [username, setUsername] = useState<string>("");

	const connectWebSocket = () => {
		const ws = new WebSocket("ws://localhost:42069/");
		ws.onmessage = handleMessage;
		setWS(ws);
	};

	const sendMessage = (msg: AnyMessage) => ws.send(JSON.stringify(msg));

	const handleMessage = (ev: MessageEvent<any>) => {
		let msg = JSON.parse(ev.data) as RegistrationMessage;
		if (msg.action === "register")
			if (msg.success) {
				setScreen("chatroom");
			} else {
				setUsername("");
				// TODO: replace alert with toast or component popup
				alert("That username is already taken!");
			}
	};

	const handleLogin = (username: string) => {
		sendMessage({
			action: "register",
			username: username,
		});
		setUsername(username);
	};

	const ScreenContent = () => {
		switch (screen) {
			case "login": return <LoginScreen onLogin={handleLogin} />;
			case "chatroom": return <ChatRoomScreen ws={ws} username={username} />
		}
	};

	useEffect(() => connectWebSocket(), []);

	return (
		<ThemeProvider theme={theme}>
			<Box display="flex" alignItems="center" justifyContent="center" height="100vh">
				<ScreenContent />
			</Box>
		</ThemeProvider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
