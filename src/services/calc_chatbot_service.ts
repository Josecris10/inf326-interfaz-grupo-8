import { gqlQuery } from "./common";

const API_URL = import.meta.env.VITE_API_GATEWAY_URL;
const GRAPHQL_PATH = "";

// ===================================================================
//  Definiciones de tipos de las respuestas GraphQL (data)
// ===================================================================

export interface EquationCalculoChatbotReply {
    query: string;
    solution: [string];
}

export interface IntegralDifferentiateCalculoChatbotReply {
    query: string;
    operation: string;
    result: string;
}


type GetEquationCalculoChatbotReply = {
    solveEquationCalculoChatbot: EquationCalculoChatbotReply;
}

type GetIntegralCalculoChatbotReply = {
    solveIntegralCalculoChatbot: IntegralDifferentiateCalculoChatbotReply;
}

type GetDifferentiateCalculoChatbotReply = {
    solveDifferentiateCalculoChatbot: IntegralDifferentiateCalculoChatbotReply;
}

// ===================================================================
//  Queries GraphQL (STRINGS)
// ===================================================================

const GET_EQUATION_QUERY = /* GraphQL */ `
    query GetEquationCalculoChatbotReply($query: String!) {
        solveEquationCalculoChatbot(query: $query) {
            query
            solution
        }
    }
`;

const GET_INTEGRAL_QUERY = /* GraphQL */ `
    query GetIntegralCalculoChatbotReply($query: String!) {
        solveIntegralCalculoChatbot(query: $query) {
            query
            operation
            result
        }
    }
`;

const GET_DIFFERENTIATE_QUERY = /* GraphQL */ `
    query GetDifferentiateCalculoChatbotReply($query: String!) {
        solveDifferentiateCalculoChatbot(query: $query) {
            query
            operation
            result
        }
    }
`;



//============================== Funciones de Servicio ==============================

export async function SolveEquationCalculoChatbotReply(
    query: string
): Promise<EquationCalculoChatbotReply> {

    const data = await gqlQuery<GetEquationCalculoChatbotReply>(
        API_URL,
        GRAPHQL_PATH,
        GET_EQUATION_QUERY,
        { query }
    );

    return data.solveEquationCalculoChatbot; // ← CORRECTO
}

export async function SolveIntegralCalculoChatbotReply(
    query: string
): Promise<IntegralDifferentiateCalculoChatbotReply> {

    const data = await gqlQuery<GetIntegralCalculoChatbotReply>(
        API_URL,
        GRAPHQL_PATH,
        GET_INTEGRAL_QUERY,
        { query }
    );

    return data.solveIntegralCalculoChatbot; // ← CORRECTO
}

export async function SolveDifferentiateCalculoChatbotReply(
    query: string
): Promise<IntegralDifferentiateCalculoChatbotReply> {

    const data = await gqlQuery<GetDifferentiateCalculoChatbotReply>(
        API_URL,
        GRAPHQL_PATH,
        GET_DIFFERENTIATE_QUERY,
        { query }
    );

    return data.solveDifferentiateCalculoChatbot; // ← CORRECTO
}