/**
 * useApi - Composable de base pour l'accès à l'API
 * 
 * Fournit un accès centralisé au client GraphQL
 * et aux configurations communes.
 */

import { GraphQLClient, getGraphQLClient } from '../services/GraphQLClient';

export interface ApiComposable {
    client: GraphQLClient;
    wordpressUrl: string;
}

export const useApi = (): ApiComposable => {
    const config = useRuntimeConfig();
    const client = getGraphQLClient();

    return {
        client,
        wordpressUrl: config.public.wordpressUrl as string
    };
};
