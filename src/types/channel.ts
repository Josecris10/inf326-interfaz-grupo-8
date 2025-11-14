export type ChannelType = "public" | "private";

export type ChannelMember = {
	id: number;
	joined_at: number;
};

export type Channel = {
	id: number;
	name: string;
	owner_id: number;
	users: ChannelMember[];
	threads: string[];
	is_active: boolean;
	channel_type: ChannelType;
	created_at: number;
	updated_at: number;
	deleted_at?: number | null;
};