import { getAuthToken } from "./storage";

function authHeaders(
	extra: Record<string, string> = {},
	tokenType: string = "Bearer"
) {
	const token = getAuthToken();

	return {
		"Content-Type": "application/json",
		...(token ? { Authorization: `${tokenType} ${token}`.trim() } : {}),
		...extra,
	};
}

type GraphQLErrorItem = {
	message: string;
	[key: string]: unknown;
};

type GraphQLResponse<T> = {
	data?: T;
	errors?: GraphQLErrorItem[];
	[key: string]: unknown;
};

async function handleGraphQLResponse<T>(res: Response): Promise<T> {
	let json: GraphQLResponse<T>;

	try {
		json = (await res.json()) as GraphQLResponse<T>;
	} catch {
		if (!res.ok) {
			const text = await res.text().catch(() => "");
			throw new Error(text || "Error en la respuesta del servidor.");
		}
		throw new Error("Respuesta vacía o no válida del servidor.");
	}

	if (!res.ok) {
		const msgFromError =
			json.errors?.[0]?.message ??
			"Error en la solicitud (HTTP " + res.status + ")";
		throw new Error(msgFromError);
	}

	if (json.errors && json.errors.length > 0) {
		const msg = json.errors[0]?.message || "Error en la consulta GraphQL.";
		throw new Error(msg);
	}

	if (json.data === undefined) {
		throw new Error("La respuesta GraphQL no contiene 'data'.");
	}

	return json.data;
}

/**
 * Cliente genérico GraphQL
 * @param API_URL   Base del gateway
 * @param path      Path del endpoint GraphQL
 * @param query     String con el query o mutation GraphQL
 * @param variables Objeto con variables (opcional)
 */
export async function graphqlRequest<T>(
	API_URL: string,
	path: string,
	query: string,
	variables?: Record<string, unknown>
): Promise<T> {
	const res = await fetch(`${API_URL}${path}`, {
		method: "POST",
		headers: authHeaders(),
		body: JSON.stringify({
			query,
			variables,
		}),
	});
	return handleGraphQLResponse<T>(res);
}

export async function gqlQuery<T>(
	API_URL: string,
	path: string,
	query: string,
	variables?: Record<string, unknown>
): Promise<T> {
	return graphqlRequest<T>(API_URL, path, query, variables);
}

export async function gqlMutation<T>(
	API_URL: string,
	path: string,
	query: string,
	variables?: Record<string, unknown>
): Promise<T> {
	return graphqlRequest<T>(API_URL, path, query, variables);
}