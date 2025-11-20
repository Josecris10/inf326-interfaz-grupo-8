export type ChannelType = "public" | "private";

export type ChannelMember = {
	id: string;
	joined_at: number;
	status: string;
};

export type Channel = {
	id: string;
	channel_type: ChannelType;
	created_at: number;
	is_active: boolean;
	name: string;
	owner_id: string;
	updated_at: number;
	users: ChannelMember[];
};