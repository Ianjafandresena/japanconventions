/**
 * Core Types - Types génériques partagés dans toute l'application
 */

// Response GraphQL standard de WordPress
export interface GraphQLResponse<T> {
    data: T;
    errors?: Array<{
        message: string;
        locations?: Array<{ line: number; column: number }>;
        path?: string[];
    }>;
}

// Liste de nodes WordPress (pattern commun)
export interface NodeList<T> {
    nodes: T[];
    pageInfo?: PageInfo;
}

// Pagination info
export interface PageInfo {
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    startCursor?: string;
    endCursor?: string;
}

// Image WordPress
export interface FeaturedImage {
    node: {
        sourceUrl: string;
        altText: string;
        mediaDetails?: {
            width: number;
            height: number;
        };
    };
}

// Base entity pour tous les types WordPress
export interface BaseEntity {
    id: string;
    databaseId?: number;
    slug: string;
    title: string;
    date?: string;
    modified?: string;
}
