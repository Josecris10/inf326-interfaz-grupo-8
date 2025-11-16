// src/services/thread_service.ts
import { gqlQuery } from "./common";
import type { Thread } from "../types/thread";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL ?? "http://localhost:8000";
const GRAPHQL_PATH = "/graphql";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface CreateThreadPayload {
	channel_id: string;     // o number, según tu tipo
	title: string;
	content: string;
	author_id: number;
	category: string;
	tags: string;
}

type CreateThreadData = {
	createThread: Thread;
};

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const CREATE_THREAD_MUTATION = /* GraphQL */ `
	mutation CreateThread(
		$channel_id: ID!
		$title: String!
		$content: String!
		$author_id: Int!
		$category: String!
		$tags: String!
	) {
		createThread(
			channel_id: $channel_id
			title: $title
			content: $content
			author_id: $author_id
			category: $category
			tags: $tags
		) {
			id
			title
			content
			author_id
			category
			tags
			created_at
			updated_at
			# agrega/quita campos según tu type Thread
		}
	}
`;

//============================== Funciones de Servicio ==============================

export async function createThread(
	payload: CreateThreadPayload
): Promise<Thread> {
	const data = await gqlQuery<CreateThreadData>(
		API_URL,
		GRAPHQL_PATH,
		CREATE_THREAD_MUTATION,
		{
			channel_id: payload.channel_id,
			title: payload.title,
			content: payload.content,
			author_id: payload.author_id,
			category: payload.category,
			tags: payload.tags,
		}
	);

	return data.createThread;
}
