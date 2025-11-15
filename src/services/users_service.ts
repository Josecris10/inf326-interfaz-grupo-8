import type { User } from "../types/user";
import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL ?? "http://localhost:8000";
const GRAPHQL_PATH = "/graphql";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface TokenResponse {
	access_token: string;
	token_type: string;
	expires_in: number;
}

export interface CreateUserPayload {
	email: string;
	username: string;
	password: string;
	full_name?: string;
}

export interface UpdateUserPayload {
	full_name?: string;
}

export interface LoginUserPayload {
	username_or_email: string;
	password: string;
}

type GetUserData = {
	getUser: User;
};

type CreateUserData = {
	createUser: User;
};

type UpdateUserData = {
	updateUser: User;
};

type LoginUserData = {
	loginUser: TokenResponse;
};

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_USER_QUERY = /* GraphQL */ `
	query GetUser($token: String!) {
		getUser(token: $token) {
			id
			email
			username
			full_name
		}
	}
`;

const CREATE_USER_MUTATION = /* GraphQL */ `
	mutation CreateUser(
		$email: String!
		$username: String!
		$password: String!
		$full_name: String
	) {
		createUser(
			email: $email
			username: $username
			password: $password
			full_name: $full_name
		) {
			id
			email
			username
			full_name
		}
	}
`;

const UPDATE_USER_MUTATION = /* GraphQL */ `
	mutation UpdateUser($full_name: String) {
		updateUser(full_name: $full_name) {
			id
			email
			username
			full_name
		}
	}
`;

const LOGIN_USER_MUTATION = /* GraphQL */ `
	mutation LoginUser(
		$username_or_email: String!
		$password: String!
	) {
		loginUser(
			username_or_email: $username_or_email
			password: $password
		) {
			access_token
			token_type
			expires_in
		}
	}
`;

//============================== Funciones de Servicio ==============================

export async function getCurrentUserWithToken(token: string): Promise<User> {
	const data = await gqlQuery<GetUserData>(
		API_URL,
		GRAPHQL_PATH,
		GET_USER_QUERY,
		{ token }
	);

	return data.getUser;
}

export async function createUser(payload: CreateUserPayload): Promise<User> {
	const data = await gqlQuery<CreateUserData>(
		API_URL,
		GRAPHQL_PATH,
		CREATE_USER_MUTATION,
		{
			email: payload.email,
			username: payload.username,
			password: payload.password,
			full_name: payload.full_name,
		}
	);

	return data.createUser;
}

// updateUser(full_name) → User
export async function updateUser(payload: UpdateUserPayload): Promise<User> {
	const data = await gqlQuery<UpdateUserData>(
		API_URL,
		GRAPHQL_PATH,
		UPDATE_USER_MUTATION,
		{
			full_name: payload.full_name ?? null,
		}
	);

	return data.updateUser;
}

// loginUser(username_or_email, password) → TokenResponse
export async function loginUser(
	payload: LoginUserPayload
): Promise<TokenResponse> {
	const data = await gqlQuery<LoginUserData>(
		API_URL,
		GRAPHQL_PATH,
		LOGIN_USER_MUTATION,
		{
			username_or_email: payload.username_or_email,
			password: payload.password,
		}
	);

	return data.loginUser;
}