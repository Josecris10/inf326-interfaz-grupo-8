import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface PrograChatbotReply {
    message: string;
}

type GetMessagePrograChatbot = {
    getMessagePrograChatbot: PrograChatbotReply;
}

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_MESSAGE_QUERY = /* GraphQL */ `
    query GetMessagePrograChatbot($message: String!) {
        getMessagePrograChatbot(message: $message) {
            reply
        }
    }
`;

//============================== Funciones de Servicio ==============================

export async function getMessagePrograChatbot(
    message: string
): Promise<PrograChatbotReply> {

    const data = await gqlQuery<GetMessagePrograChatbot>(
        API_URL,
        GRAPHQL_PATH,
        GET_MESSAGE_QUERY,
        { message }
    );

    return data.getMessagePrograChatbot; // ← CORRECTO
}
