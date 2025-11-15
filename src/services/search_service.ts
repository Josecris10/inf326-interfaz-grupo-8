import type { Message } from "../types/message";
import type { Thread } from "../types/thread";
import type { Channel } from "../types/channel";
import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL ?? "http://localhost:8000";
const GRAPHQL_PATH = "/graphql";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

type SearchMessagesData = {
	searchMessages: Message[];
};

type SearchChannelsData = {
	searchChannels: Channel[];
};

type ThreadByIdData = {
	threadById: Thread | null;
};

type ThreadsByCategoryData = {
	threadsByCategory: Thread[];
};

type ThreadsByAuthorData = {
	threadsByAuthor: Thread[];
};

type ThreadsByDateRangeData = {
	threadsByDateRange: Thread[];
};

type ThreadsByTagData = {
	threadsByTag: Thread[];
};

type ThreadsByKeywordData = {
	threadsByKeyword: Thread[];
};

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const SEARCH_MESSAGES_QUERY = /* GraphQL */ `
	query SearchMessages(
		$q: String
		$authorId: Int
		$threadId: Int
		$messageId: Int
		$limit: Int
		$offset: Int
	) {
		searchMessages(
			q: $q
			authorId: $authorId
			threadId: $threadId
			messageId: $messageId
			limit: $limit
			offset: $offset
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

const SEARCH_CHANNELS_QUERY = /* GraphQL */ `
	query SearchChannels(
		$q: String
		$channelId: Int
		$limit: Int
		$offset: Int
	) {
		searchChannels(
			q: $q
			channelId: $channelId
			limit: $limit
			offset: $offset
		) {
			id
			name
			owner_id
			users
			threads
			is_active
			channel_type
			created_at
			updated_at
			deleted_at
		}
	}
`;

const THREAD_BY_ID_QUERY = /* GraphQL */ `
	query ThreadById($id: ID!) {
		threadById(id: $id) {
			id
			title
			content
			author_id
			channel_id
			creation_date
			tags
			category
		}
	}
`;

const THREADS_BY_CATEGORY_QUERY = /* GraphQL */ `
	query ThreadsByCategory($category: String!) {
		threadsByCategory(category: $category) {
			id
			title
			content
			author_id
			channel_id
			creation_date
			tags
			category
		}
	}
`;

const THREADS_BY_AUTHOR_QUERY = /* GraphQL */ `
	query ThreadsByAuthor($author: String!) {
		threadsByAuthor(author: $author) {
			id
			title
			content
			author_id
			channel_id
			creation_date
			tags
			category
		}
	}
`;

const THREADS_BY_DATERANGE_QUERY = /* GraphQL */ `
	query ThreadsByDateRange($startDate: String!, $endDate: String!) {
		threadsByDateRange(startDate: $startDate, endDate: $endDate) {
			id
			title
			content
			author_id
			channel_id
			creation_date
			tags
			category
		}
	}
`;

const THREADS_BY_TAG_QUERY = /* GraphQL */ `
	query ThreadsByTag($tag: String!) {
		threadsByTag(tag: $tag) {
			id
			title
			content
			author_id
			channel_id
			creation_date
			tags
			category
		}
	}
`;

const THREADS_BY_KEYWORD_QUERY = /* GraphQL */ `
	query ThreadsByKeyword($keyword: String!) {
		threadsByKeyword(keyword: $keyword) {
			id
			title
			content
			author_id
			channel_id
			creation_date
			tags
			category
		}
	}
`;

//============================== Busqueda de Messages ==============================

export async function searchMessage(
	q?: string,
	authorId?: number,
	threadId?: number,
	messageId?: number,
	limit?: number,
	offset?: number
): Promise<Message[]> {
	const data = await gqlQuery<SearchMessagesData>(
		API_URL,
		GRAPHQL_PATH,
		SEARCH_MESSAGES_QUERY,
		{
			q,
			authorId,
			threadId,
			messageId,
			limit,
			offset,
		}
	);

	return data.searchMessages ?? [];
}

//============================== Busqueda de Threads ==============================

export async function getThreadById(threadId: string): Promise<Thread | null> {
	const data = await gqlQuery<ThreadByIdData>(
		API_URL,
		GRAPHQL_PATH,
		THREAD_BY_ID_QUERY,
		{
			id: threadId,
		}
	);

	return data.threadById ?? null;
}

export async function getThreadByCategory(
	threadCategory: string
): Promise<Thread[]> {
	const data = await gqlQuery<ThreadsByCategoryData>(
		API_URL,
		GRAPHQL_PATH,
		THREADS_BY_CATEGORY_QUERY,
		{
			category: threadCategory,
		}
	);

	return data.threadsByCategory ?? [];
}

export async function getThreadByAuthor(
	threadAuthor: string
): Promise<Thread[]> {
	const data = await gqlQuery<ThreadsByAuthorData>(
		API_URL,
		GRAPHQL_PATH,
		THREADS_BY_AUTHOR_QUERY,
		{
			author: threadAuthor,
		}
	);

	return data.threadsByAuthor ?? [];
}

export async function getThreadByDaterange(
	startDate: string,
	endDate: string
): Promise<Thread[]> {
	const data = await gqlQuery<ThreadsByDateRangeData>(
		API_URL,
		GRAPHQL_PATH,
		THREADS_BY_DATERANGE_QUERY,
		{
			startDate,
			endDate,
		}
	);

	return data.threadsByDateRange ?? [];
}

export async function getThreadByTag(threadTag: string): Promise<Thread[]> {
	const data = await gqlQuery<ThreadsByTagData>(
		API_URL,
		GRAPHQL_PATH,
		THREADS_BY_TAG_QUERY,
		{
			tag: threadTag,
		}
	);

	return data.threadsByTag ?? [];
}

export async function getThreadByKeyword(
	threadKeyword: string
): Promise<Thread[]> {
	const data = await gqlQuery<ThreadsByKeywordData>(
		API_URL,
		GRAPHQL_PATH,
		THREADS_BY_KEYWORD_QUERY,
		{
			keyword: threadKeyword,
		}
	);

	return data.threadsByKeyword ?? [];
}

//============================== Busqueda de Channels ==============================

export async function searchChannel(
	q?: string,
	channelId?: number,
	limit?: number,
	offset?: number
): Promise<Channel[]> {
	const data = await gqlQuery<SearchChannelsData>(
		API_URL,
		GRAPHQL_PATH,
		SEARCH_CHANNELS_QUERY,
		{
			q,
			channelId,
			limit,
			offset,
		}
	);

	return data.searchChannels ?? [];
}
