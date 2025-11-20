import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface WikipediaChatbotReply {
    message: string;
}

type GetMessageWikipediaChatbot = {
    getMessageWikipediaChatbot: WikipediaChatbotReply;
}

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_MESSAGE_QUERY = /* GraphQL */ `
    query GetMessageWikipediaChatbot($message: String!) {
        getMessageWikipediaChatbot(message: $message) {
            message
        }
    }
`;

//============================== Funciones de Servicio ==============================

export async function getMessageWikipediaChatbot(
    message: string
): Promise<WikipediaChatbotReply> {

    const data = await gqlQuery<GetMessageWikipediaChatbot>(
        API_URL,
        GRAPHQL_PATH,
        GET_MESSAGE_QUERY,
        { message }
    );

    return data.getMessageWikipediaChatbot; // ← CORRECTO
}
