// src/services/thread_service.ts
import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface ModerateMessageResponse {
    is_approved: boolean;
    action: string;
    severity: string;
    toxicity_score: number;
    strike_count: number;
    message: string;
    detected_words?: string[] | null;
    language?: string | null;
    ban_info?: Record<string, any> | null;
}

type CreateModerate = {
    createModerate: ModerateMessageResponse;
};

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const CREATE_MODERATE_MUTATION = /* GraphQL */ `
    mutation CreateModerate(
        $message_id: String!
        $user_id: String!
        $channel_id: String!
        $content: String!
    ) {
        createModerate(
            message_id: $message_id
            user_id: $user_id
            channel_id: $channel_id
            content: $content
        ) {
            is_approved
            action
            severity
            toxicity_score
            strike_count
            message
            detected_words
            language
            ban_info
        }
    }
`;

//============================== Funciones de Servicio ==============================

export async function createModerate(
    message_id: string,
    user_id: string,
    channel_id: string,
    content: string
): Promise<ModerateMessageResponse> {
    const data = await gqlQuery<CreateModerate>(
        API_URL,
        GRAPHQL_PATH,
        CREATE_MODERATE_MUTATION,
        {
            message_id: message_id,
            user_id: user_id,
            channel_id: channel_id,
            content: content,
        }
    );

    return data.createModerate;
}
