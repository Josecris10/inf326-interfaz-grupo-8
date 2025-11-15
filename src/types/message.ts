export type MessageType = "text" | "audio" | "file";

export type Message = {
	id: string;
	thread_id: string;
	user_id: string;
	type: MessageType | null;
	content: string | null;
	paths: string[] | null;
	created_at: string | null;
	updated_at: string | null;
};