import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { LoginScreen } from "./LoginScreen";

type Screen = "login";

const App = () => {
	const [ws, setWS] = useState<WebSocket>(undefined);
	const [screen, setScreen] = useState<Screen>("login");

	const connectWebSocket = () => {
		const ws = new WebSocket("ws://localhost:42069/");
		ws.onmessage = (ev) => alert(ev.data);
		setWS(ws);
	};

	const ScreenContent = () => {
		switch (screen) {
			case "login": return <LoginScreen />;
		}
	};

	useEffect(() => connectWebSocket(), []);

	return (
		<React.Fragment>
			<ScreenContent />
		</React.Fragment>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
