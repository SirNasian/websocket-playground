import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
	const [ws, _setWS] = useState<WebSocket>(new WebSocket("ws://localhost:42069/"));
	const [topicText, setTopicText] = useState<string>("");
	const [messageText, setMessageText] = useState<string>("");

	const handleSubscribe = () => ws.send(JSON.stringify({action: "subscribe", topic: topicText}));
	const handleUnsubscribe = () => ws.send(JSON.stringify({action: "unsubscribe", topic: topicText}));
	const handleMessage = () => ws.send(JSON.stringify({action: "message", topic: topicText, data: messageText}));

	useEffect(() => { ws.onmessage = (ev) => alert(ev.data); }, [])

	return (
		<React.Fragment>
			<div>
				<input id="topicText" type="text" value={topicText} onChange={(event) => setTopicText(event.target.value)} />
				<button type="button" onClick={handleSubscribe}>subscribe</button>
				<button type="button" onClick={handleUnsubscribe}>unsubscribe</button>
			</div>
			<div>
				<input id="messageText" type="text" value={messageText} onChange={(event) => setMessageText(event.target.value)} />
				<button type="button" onClick={handleMessage}>message</button>
			</div>
		</React.Fragment>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
