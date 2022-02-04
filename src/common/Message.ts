export interface Message {
	action: "subscribe" | "unsubscribe" | "message" | "register";
};

export interface RegistrationMessage extends Message {
	action: "register";
	username: string;
	success: boolean;
};

export interface SubscriptionMessage extends Message {
	action: "subscribe" | "unsubscribe";
	topic: string;
	success: boolean;
};

export interface ChatMessage extends Message {
	action: "message";
	topic: string;
	data: {
		date: string;
		user: string;
		text: string;
	};
};

export type AnyMessage = Message | RegistrationMessage | SubscriptionMessage | ChatMessage;
