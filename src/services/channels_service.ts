import type { Channel } from "../types/channel";
import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface CreateChannelPayload {
	name: string;
	owner_id: string;
	users: number[];
	channel_type: string;
}

export interface UpdateChannelPayload {
	channel_id: number;
	name: string;
	owner_id: number;
	channel_type: string;
}

type GetChannelData = {
	getChannel: Channel | null;
};

type CreateChannelData = {
	createChannel: Channel;
};

type UpdateChannelData = {
	updateChannel: Channel;
};

type ReactivateChannelData = {
	reactivateChannel: Channel;
};

type DeleteChannelData = {
	deleteChannel: Channel;
};

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_CHANNEL_QUERY = /* GraphQL */ `
	query GetChannel($channel_id: String!) {
		getChannel(channel_id: $channel_id) {
			id
			name
			owner_id
			users {
				id
				joined_at
			}
			is_active
			channel_type
			created_at
			updated_at
			deleted_at
		}
	}
`;

const CREATE_CHANNEL_MUTATION = /* GraphQL */ `
	mutation CreateChannel(
		$name: String!
		$owner_id: String!
		$users: [ChannelMemberInput!]!
		$channel_type: ChannelType!
	) {
		createChannel(
			name: $name
			owner_id: $owner_id
			users: $users
			channel_type: $channel_type
		) {
			id
			name
			owner_id
			channel_type
			users {
				id
				joined_at
			}
		}
	}
`

const UPDATE_CHANNEL_MUTATION = /* GraphQL */ `
	mutation UpdateChannel(
		$channel_id: Int!
		$name: String!
		$owner_id: Int!
		$channel_type: String!
	) {
		updateChannel(
			channel_id: $channel_id
			name: $name
			owner_id: $owner_id
			channel_type: $channel_type
		) {
			id
			name
			owner_id
			channel_type
			users
		}
	}
`;

const REACTIVATE_CHANNEL_MUTATION = /* GraphQL */ `
	mutation ReactivateChannel($channel_id: Int!) {
		reactivateChannel(channel_id: $channel_id) {
			id
			name
			owner_id
			channel_type
			users
		}
	}
`;

const DELETE_CHANNEL_MUTATION = /* GraphQL */ `
	mutation DeleteChannel($channel_id: Int!) {
		deleteChannel(channel_id: $channel_id) {
			id
			name
			owner_id
			channel_type
			users
		}
	}
`;

//============================== Funciones de Servicio ==============================

export async function getChannelById(channel_id: string): Promise<Channel | null> {
	const data = await gqlQuery<GetChannelData>(
		API_URL,
		GRAPHQL_PATH,
		GET_CHANNEL_QUERY,
		{ channel_id }
	);

	return data.getChannel ?? null;
}

export async function createChannel(payload: CreateChannelPayload): Promise<Channel> {
	const data = await gqlQuery<CreateChannelData>(
		API_URL,
		GRAPHQL_PATH,
		CREATE_CHANNEL_MUTATION,
		{
			name: payload.name,
			owner_id: payload.owner_id,
			users: payload.users,
			channel_type: payload.channel_type,
		}
	);

	return data.createChannel;
}

export async function updateChannel(payload: UpdateChannelPayload): Promise<Channel> {
	const data = await gqlQuery<UpdateChannelData>(
		API_URL,
		GRAPHQL_PATH,
		UPDATE_CHANNEL_MUTATION,
		{
			channel_id: payload.channel_id,
			name: payload.name,
			owner_id: payload.owner_id,
			channel_type: payload.channel_type,
		}
	);

	return data.updateChannel;
}

export async function reactivateChannel(channel_id: number): Promise<Channel> {
	const data = await gqlQuery<ReactivateChannelData>(
		API_URL,
		GRAPHQL_PATH,
		REACTIVATE_CHANNEL_MUTATION,
		{ channel_id }
	);

	return data.reactivateChannel;
}

export async function deleteChannel(channel_id: number): Promise<Channel> {
	const data = await gqlQuery<DeleteChannelData>(
		API_URL,
		GRAPHQL_PATH,
		DELETE_CHANNEL_MUTATION,
		{ channel_id }
	);

	return data.deleteChannel;
}