import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

type DataPresenceStatsReply = {
    total: number;
    online: number;
    offline: number;
}

export interface GetPresenceStatsReply {
    status: string;
    message: string;
    data: DataPresenceStatsReply;
}

type GetPresenceStats = {
    getPresenceStats: GetPresenceStatsReply;
}

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_MESSAGE_QUERY = /* GraphQL */ `
    query GetPresenceStats {
        getPresenceStats {
            status
            message
            data {
                total
                online
                offline
            }
        }
    }
`;

//============================== Funciones de Servicio ==============================

export async function getPresenceStats(
): Promise<GetPresenceStatsReply> {

    const data = await gqlQuery<GetPresenceStats>(
        API_URL,
        GRAPHQL_PATH,
        GET_MESSAGE_QUERY,
        { }
    );

    return data.getPresenceStats; // ← CORRECTO
}
