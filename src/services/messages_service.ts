import type { Message } from "../types/message";
import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

type GetMessageData = {
	getMessage: Message[];
};

type CreateMessageData = {
	createMessage: Message;
};

type UpdateMessageData = {
	updateMessage: Message;
};

type DeleteMessageData = {
	deleteMessage: boolean;
};

export interface CreateMessagePayload {
	thread_id: string;
	content: string;
	type_: string;
	paths: string[];
	user_id: string;
}

export interface UpdateMessagePayload {
	thread_id: string;
	message_id: string;
	content: string;
	type_: string;
	paths: string[];
	user_id: string;
}

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_MESSAGE_QUERY = /* GraphQL */ `
	query GetMessage($thread_id: String!, $user_id: String!) {
		getMessage(thread_id: $thread_id, user_id: $user_id) {
			id
			thread_id
			user_id
			type
			content
			paths
			created_at
			updated_at
		}
	}
`;

const CREATE_MESSAGE_MUTATION = /* GraphQL */ `
	mutation CreateMessage(
		$thread_id: String!
		$content: String!
		$type_: String!
		$paths: [String!]!
		$user_id: String!
	) {
		createMessage(
			thread_id: $thread_id
			content: $content
			type_: $type_
			paths: $paths
			user_id: $user_id
		) {
			id
			thread_id
			user_id
			type
			content
			paths
			created_at
			updated_at
		}
	}
`;

const UPDATE_MESSAGE_MUTATION = /* GraphQL */ `
	mutation UpdateMessage(
		$thread_id: String!
		$message_id: String!
		$content: String!
		$type_: String!
		$paths: [String!]!
		$user_id: String!
	) {
		updateMessage(
			thread_id: $thread_id
			message_id: $message_id
			content: $content
			type_: $type_
			paths: $paths
			user_id: $user_id
		) {
			id
			thread_id
			user_id
			type
			content
			paths
			created_at
			updated_at
		}
	}
`;

const DELETE_MESSAGE_MUTATION = /* GraphQL */ `
	mutation DeleteMessage(
		$thread_id: String!
		$message_id: String!
		$user_id: String!
	) {
		deleteMessage(
			thread_id: $thread_id
			message_id: $message_id
			user_id: $user_id
		)
	}
`;

//============================== Funciones de Servicio ==============================

export async function getMessagesByThread(
	thread_id: string,
	user_id: string
): Promise<Message[]> {
	const data = await gqlQuery<GetMessageData>(
		API_URL,
		GRAPHQL_PATH,
		GET_MESSAGE_QUERY,
		{
			thread_id,
			user_id,
		}
	);

	return data.getMessage ?? [];
}

export async function createMessage(
	payload: CreateMessagePayload
): Promise<Message> {
	const data = await gqlQuery<CreateMessageData>(
		API_URL,
		GRAPHQL_PATH,
		CREATE_MESSAGE_MUTATION,
		{
			thread_id: payload.thread_id,
			content: payload.content,
			type_: payload.type_,
			paths: payload.paths,
			user_id: payload.user_id,
		}
	);

	return data.createMessage;
}

export async function updateMessage(
	payload: UpdateMessagePayload
): Promise<Message> {
	const data = await gqlQuery<UpdateMessageData>(
		API_URL,
		GRAPHQL_PATH,
		UPDATE_MESSAGE_MUTATION,
		{
			thread_id: payload.thread_id,
			message_id: payload.message_id,
			content: payload.content,
			type_: payload.type_,
			paths: payload.paths,
			user_id: payload.user_id,
		}
	);

	return data.updateMessage;
}

export async function deleteMessage(
	thread_id: string,
	message_id: string,
	user_id: string
): Promise<boolean> {
	const data = await gqlQuery<DeleteMessageData>(
		API_URL,
		GRAPHQL_PATH,
		DELETE_MESSAGE_MUTATION,
		{
			thread_id,
			message_id,
			user_id,
		}
	);

	return data.deleteMessage;
}