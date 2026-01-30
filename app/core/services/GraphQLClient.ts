/**
 * GraphQL Client - Service de base pour les requêtes GraphQL
 * 
 * Ce client centralise toutes les communications avec l'API WPGraphQL
 * et gère les erreurs de manière uniforme.
 */

import type { GraphQLResponse } from '../types';

export interface GraphQLClientOptions {
    baseUrl: string;
    headers?: Record<string, string>;
}

export class GraphQLClient {
    private baseUrl: string;
    private headers: Record<string, string>;

    constructor(options: GraphQLClientOptions) {
        this.baseUrl = options.baseUrl;
        this.headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
    }

    /**
     * Exécute une requête GraphQL avec $fetch (utilisable côté serveur et client)
     * @param query - La requête GraphQL
     * @param variables - Les variables de la requête
     * @returns Les données typées
     */
    async query<T>(query: string, variables?: Record<string, unknown>): Promise<T> {
        const response = await $fetch<GraphQLResponse<T>>(this.baseUrl, {
            method: 'POST',
            headers: this.headers,
            body: {
                query,
                variables
            }
        });

        if (response.errors && response.errors.length > 0) {
            const errorMessages = response.errors.map(e => e.message).join(', ');
            throw new Error(`GraphQL Error: ${errorMessages}`);
        }

        if (!response.data) {
            throw new Error('No data returned from GraphQL API');
        }

        return response.data;
    }

    /**
     * Getter pour l'URL de base
     */
    getBaseUrl(): string {
        return this.baseUrl;
    }
}

/**
 * Crée une nouvelle instance du client GraphQL
 * Cette fonction doit être appelée dans un contexte Vue (setup, composable, etc.)
 */
export function createGraphQLClient(): GraphQLClient {
    const config = useRuntimeConfig();
    return new GraphQLClient({
        baseUrl: config.public.wordpressUrl as string
    });
}
