import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Box } from "@mui/material";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { LoginScreen } from "./LoginScreen";

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
		<ThemeProvider theme={theme}>
			<Box display="flex" alignItems="center" justifyContent="center" height="100vh">
				<ScreenContent />
			</Box>
		</ThemeProvider>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
