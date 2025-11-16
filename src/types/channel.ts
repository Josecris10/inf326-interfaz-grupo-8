export type ChannelType = "public" | "private";

export type ChannelMember = {
	id: string;
	joined_at: string;
};

export type Channel = {
	id: number;
	name: string;
	owner_id: number;
	users: ChannelMember[];
	threads: string[];
	is_active: boolean;
	channel_type: ChannelType;
	created_at: string;
	updated_at: string;
	deleted_at?: string | null;
};