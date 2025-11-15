export type ChatMessage = {
	id: number;
	sender: "user" | "bot";
	content: string;
};