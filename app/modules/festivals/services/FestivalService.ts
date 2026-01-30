/**
 * Festival Service - Service pour récupérer les données des festivals
 * 
 * Les festivals sont définis en configuration car ils ne sont pas tous
 * dans le menu WordPress mais affichés sur la page d'accueil du site.
 */

import { createGraphQLClient, type GraphQLClient } from '~/core/services/GraphQLClient';
import type { FeaturedImage } from '~/core/types';

// Types
export interface Festival {
    id: string;
    name: string;
    slug: string;
    path: string;
    logo: string;
    color: string;
    events: FestivalEvent[];
}

export interface FestivalEvent {
    id: string;
    title: string;
    slug: string;
    uri: string;
    city: string;
    venue: string;
}

export interface PressArticle {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    featuredImage?: FeaturedImage;
    categories: Array<{ name: string; slug: string }>;
    url: string;
}

/**
 * Configuration des festivals (selon le site officiel)
 */
const FESTIVALS_CONFIG = [
    {
        slug: 'japan-otaku-festival',
        name: 'Japan Otaku Festival',
        path: '/japan-otaku-festival/',
        logo: 'https://japanconventions.com/wp-content/uploads/2025/08/Japan-Otaku-festival-Logo-1536x1536-1-3.png',
        color: '#e60012'
    },
    {
        slug: 'japan-manga-wave',
        name: 'Japan Manga Wave',
        path: '/japan-manga-wave/',
        logo: 'https://japanconventions.com/wp-content/uploads/2025/08/LOGO-JMW-A-carree-1.png',
        color: '#e60012'
    },
    {
        slug: 'gamer-connection',
        name: 'Gamer Connection',
        path: '/gamer-connection/',
        logo: 'https://japanconventions.com/wp-content/uploads/2025/10/gamer-connection-logo.png',
        color: '#e60012'
    },
    {
        slug: 'evenement-a-venir',
        name: 'One Night Event',
        path: '/evenement-a-venir/',
        logo: 'https://japanconventions.com/wp-content/uploads/2025/10/logoFever.jpg',
        color: '#e60012'
    },
    {
        slug: 'ink-secret',
        name: 'Ink Secret',
        path: '/ink-secret/',
        logo: 'https://japanconventions.com/wp-content/uploads/2025/10/logotatouage.jpg',
        color: '#e60012'
    }
];

/**
 * Patterns de pages à exclure (pages administratives, pas des villes)
 */
const EXCLUDED_PAGE_PATTERNS = [
    'dossier', 'exposant', 'visiteur', 'benevole', 'bénévole', 'association',
    'date', 'horaire', 'acces', 'accès', 'stand', 'pass', 'formulaire',
    'consigne', 'dispositif', 'billetterie', 'pmr', 'vip', 'individuel',
    'familial', 'senior', 'etudiant', 'école', 'ecole', 'cse', 'bde'
];

/**
 * Patterns cross-festival (à exclure uniquement dans les autres festivals)
 */
const CROSS_FESTIVAL_PATTERNS: Record<string, string[]> = {
    'japan-otaku-festival': ['ink secret', 'ink-secret', 'gamer connection', 'one night', 'onoe'],
    'japan-manga-wave': ['ink secret', 'ink-secret', 'gamer connection', 'one night', 'onoe', 'japan otaku'],
    'gamer-connection': ['ink secret', 'ink-secret', 'japan otaku', 'japan manga', 'one night', 'onoe'],
    'ink-secret': ['gamer connection', 'japan otaku', 'japan manga', 'one night', 'onoe'],
    'evenement-a-venir': ['ink secret', 'ink-secret', 'gamer connection', 'japan otaku', 'japan manga']
};

/**
 * Vérifie si une page est une ville (pas une page administrative ou cross-festival)
 */
function isEventCity(title: string, slug: string, festivalSlug: string): boolean {
    const lowerTitle = title.toLowerCase();
    const lowerSlug = slug.toLowerCase();

    // Vérifier les patterns administratifs
    for (const pattern of EXCLUDED_PAGE_PATTERNS) {
        if (lowerTitle.includes(pattern) || lowerSlug.includes(pattern)) {
            return false;
        }
    }

    // Vérifier les patterns cross-festival
    const crossPatterns = CROSS_FESTIVAL_PATTERNS[festivalSlug] || [];
    for (const pattern of crossPatterns) {
        if (lowerTitle.includes(pattern) || lowerSlug.includes(pattern)) {
            return false;
        }
    }

    return true;
}

/**
 * Extrait ville et lieu du titre
 */
function parseEventTitle(title: string): { city: string; venue: string } {
    // Nettoyer le titre des suffixes de festival
    let cleanTitle = title.replace(/–\s*gamer connection/i, '').trim();
    cleanTitle = cleanTitle.replace(/–\s*japan otaku festival/i, '').trim();

    const parts = cleanTitle.split('–').map(p => p.trim());
    const firstPart = parts[0] || '';
    const secondPart = parts[1] || '';

    if (parts.length >= 2 && firstPart && secondPart) {
        const cityKeywords = [
            'marseille', 'albi', 'troyes', 'chambéry', 'chambery',
            'caen', 'niort', 'castres', 'chalôn', 'chalon', 'roche',
            'aubagne', 'évreux', 'evreux', 'nice', 'metz', 'lisieux',
            'st-etienne', 'saint-etienne', 'douai', 'rennes', 'strasbourg',
            'amiens', 'colmar'
        ];

        if (cityKeywords.some(k => firstPart.toLowerCase().includes(k))) {
            return { city: firstPart, venue: secondPart };
        } else if (cityKeywords.some(k => secondPart.toLowerCase().includes(k))) {
            return { venue: firstPart, city: secondPart };
        }
    }

    return { city: cleanTitle, venue: '' };
}

/**
 * Déduplique les événements par ville
 */
function deduplicateEvents(events: FestivalEvent[]): FestivalEvent[] {
    const seen = new Set<string>();
    return events.filter(event => {
        const key = event.city.toLowerCase().trim();
        if (seen.has(key)) {
            return false;
        }
        seen.add(key);
        return true;
    });
}

/**
 * Récupère les événements (villes) d'un festival
 */
export async function getFestivalEvents(client: GraphQLClient, path: string, festivalSlug: string): Promise<FestivalEvent[]> {
    const query = `
        query GetFestivalChildren($uri: ID!) {
            page(id: $uri, idType: URI) {
                id
                children(first: 100) {
                    nodes {
                        ... on Page {
                            id
                            title
                            slug
                            uri
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await client.query<{ page: any }>(query, { uri: path });

        if (!response.page) return [];

        const events = response.page.children.nodes
            .filter((child: any) => isEventCity(child.title, child.slug, festivalSlug))
            .map((child: any) => {
                const { city, venue } = parseEventTitle(child.title);
                return {
                    id: child.id,
                    title: child.title,
                    slug: child.slug,
                    uri: child.uri,
                    city,
                    venue
                };
            });

        // Dédupliquer par ville
        return deduplicateEvents(events);
    } catch (error) {
        console.error(`Error fetching events for ${path}:`, error);
        return [];
    }
}

/**
 * Récupère un festival avec ses événements
 */
export async function getFestival(client: GraphQLClient, slug: string): Promise<Festival | null> {
    const config = FESTIVALS_CONFIG.find(f => f.slug === slug);
    if (!config) return null;

    const events = await getFestivalEvents(client, config.path, config.slug);

    return {
        id: `festival-${config.slug}`,
        name: config.name,
        slug: config.slug,
        path: config.path,
        logo: config.logo,
        color: config.color,
        events
    };
}

/**
 * Récupère tous les festivals avec leurs événements
 */
export async function getAllFestivals(client: GraphQLClient): Promise<Festival[]> {
    const festivals: Festival[] = [];

    for (const config of FESTIVALS_CONFIG) {
        const events = await getFestivalEvents(client, config.path, config.slug);

        festivals.push({
            id: `festival-${config.slug}`,
            name: config.name,
            slug: config.slug,
            path: config.path,
            logo: config.logo,
            color: config.color,
            events
        });
    }

    return festivals;
}

/**
 * Récupère les articles de presse
 */
export async function getPressArticles(client: GraphQLClient, first: number = 10): Promise<PressArticle[]> {
    const query = `
        query GetPosts($first: Int) {
            posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
                nodes {
                    id
                    title
                    slug
                    date
                    excerpt
                    uri
                    featuredImage {
                        node {
                            sourceUrl
                            altText
                        }
                    }
                    categories {
                        nodes {
                            name
                            slug
                        }
                    }
                }
            }
        }
    `;

    try {
        const response = await client.query<{ posts: { nodes: any[] } }>(query, { first });

        return response.posts.nodes.map(post => ({
            id: post.id,
            title: post.title,
            slug: post.slug,
            date: post.date,
            excerpt: post.excerpt?.replace(/<[^>]*>/g, '') || '',
            featuredImage: post.featuredImage,
            categories: post.categories?.nodes || [],
            url: post.uri
        }));
    } catch (error) {
        console.error('Error fetching posts:', error);
        return [];
    }
}

/**
 * Créer le service Festivals
 */
export function createFestivalService() {
    const client = createGraphQLClient();

    return {
        getFestival: (slug: string) => getFestival(client, slug),
        getAllFestivals: () => getAllFestivals(client),
        getFestivalEvents: (path: string) => getFestivalEvents(client, path),
        getPressArticles: (first?: number) => getPressArticles(client, first),
        getFestivalsConfig: () => FESTIVALS_CONFIG
    };
}
