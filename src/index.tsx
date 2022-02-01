import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";

const App = () => {
	const [ws, _setWS] = useState<WebSocket>(new WebSocket("ws://localhost:42069/"));
	const [topicText, setTopicText] = useState<string>("");
	const [messageText, setMessageText] = useState<string>("");
	const [topicList, setTopicList] = useState<string[]>([]);

	const handleSubscribe = () => {
		let newTopicList = [...topicList];
		topicText.split(";").forEach(topicText => {
			ws.send(JSON.stringify({action: "subscribe", topic: topicText.trim()}));
			if (!newTopicList.find(topic => topic === topicText.trim()))
				newTopicList.push(topicText.trim());
		});
		setTopicList(newTopicList);
	};

	const handleUnsubscribe = () => {
		let newTopicList = [...topicList];
		topicText.split(";").forEach(topicText => {
			ws.send(JSON.stringify({action: "unsubscribe", topic: topicText.trim()}));
			newTopicList = newTopicList.filter((topic) => topic !== topicText.trim());
		});
		setTopicList(newTopicList);
	};

	const handleMessage = () => {
		topicText.split(";").forEach(topicText => {
			ws.send(JSON.stringify({action: "message", topic: topicText.trim(), data: messageText}));
		});
	};

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
			<br />
			<div>
				<b>Sending "{messageText}" to `{topicText}`</b>
			</div>
			<br />
			<div>
				<b>Topics subscribed to</b>
			</div>
			{topicList.map((topic) => <div>{topic}</div>)}
		</React.Fragment>
	);
};

ReactDOM.render(<App />, document.getElementById("root"));
