export interface Message {
	action: "subscribe" | "unsubscribe" | "message" | "register";
	topic?: string;
	data?: string;
};


export default Message
