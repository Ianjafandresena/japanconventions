/**
 * CPT Service - Service pour récupérer les données des CPTs WordPress
 * 
 * Ce service utilise les nouveaux Custom Post Types :
 * - festivals : CPT Festival
 * - vNements : CPT Événement
 */

import { createGraphQLClient, type GraphQLClient } from '~/core/services/GraphQLClient';
import type { FeaturedImage } from '~/core/types';
import type { PressArticle } from '../types/Festival';

// ============================================================================
// TYPES
// ============================================================================

export interface CPTFestival {
    databaseId: number;
    title: string;
    slug: string;
    detailsFestival: {
        idLogo: string[];
        color: string;
        statut: string[];
        // urlExposant?: string; // pas encore dans ACF
        // urlBilletterie?: string; // pas encore dans ACF
    };
}

export interface CPTEvenement {
    databaseId: number;
    title: string;
    slug: string;
    detailsEvenement: {
        nomDuLieu: string;
        dateDeDebut: string;
        dateDeFin: string;
        statut: string[];
        urlBilletterie?: string;
        image?: {
            node?: {
                sourceUrl?: string;
            };
        };
        facebook?: string;
        instagram?: string;
        // urlExposant?: string; 
        festival?: {
            nodes: Array<{
                databaseId: number;
            }>;
        };
    };
    villes: {
        nodes: Array<{
            name: string;
            slug: string;
        }>;
    };
}

// Types transformés pour le frontend (compatibles avec le template existant)
export interface Festival {
    id: string;
    name: string;
    slug: string;
    path: string;
    logo: string;
    color: string;
    exposantUrl?: string;
    visiteurUrl?: string;
    events: FestivalEvent[];
}

export interface FestivalEvent {
    id: string;
    title: string;
    slug: string;
    uri: string;
    city: string;
    venue: string;
    dateDebut?: string;
    dateFin?: string;
    statut?: string;
    urlBilletterie?: string;
    urlExposant?: string;
    image?: string;
    facebook?: string;
    instagram?: string;
}

export interface Evenement {
    id: number;
    title: string;
    slug: string;
    lieu: string;
    dateDebut: string;
    dateFin: string;
    statut: string;
    billetterieUrl?: string;
    ville: string;
    festivalId?: number;
}

// ============================================================================
// QUERIES GRAPHQL
// ============================================================================

const GET_ALL_FESTIVALS = `
    query GetAllFestivals {
        festivals(first: 100) {
            nodes {
                databaseId
                title
                slug
                detailsFestival {
                    idLogo
                    color
                    statut
                }
            }
        }
    }
`;

const GET_FESTIVAL_BY_SLUG = `
    query GetFestivalBySlug($slug: ID!) {
        festival(id: $slug, idType: SLUG) {
            databaseId
            title
            slug
            detailsFestival {
                idLogo
                color
                statut
            }
        }
    }
`;

const GET_POSTS = `
    query GetPosts($first: Int) {
        posts(first: $first, where: {orderby: [{field: DATE, order: DESC}]}) {
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

const GET_HUB_DATA = `
    query GetHubData {
        festivals(first: 100) {
            nodes {
                databaseId
                title
                slug
                detailsFestival {
                    idLogo
                    color
                    statut
                }
            }
        }
        vNements(first: 100) {
            nodes {
                databaseId
                title
                slug
                detailsEvenement {
                    nomDuLieu
                    dateDeDebut
                    dateDeFin
                    statut
                    image {
                        node {
                            sourceUrl
                        }
                    }
                    facebook
                    instagram
                    festival {
                        nodes {
                            databaseId
                        }
                    }
                }
                villes {
                    nodes {
                        name
                        slug
                    }
                }
            }
        }
    }
`;

const GET_PAGES_HIERARCHY = `
query GetPagesHierarchy {
  pages(where: { parent: 0 }, first: 100) {
    nodes {
      title
      slug
      uri
      children(first: 100) {
        nodes {
          ... on Page {
            title
            slug
            uri
            children(first: 50) {
              nodes {
                ... on Page {
                  title
                  slug
                  uri
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

// ============================================================================
// LOGO MAPPING - URLs des logos par ID
// ============================================================================

const GET_EVENEMENTS_BY_FESTIVAL = `
    query GetEvenementsByFestival($festivalId: Int!) {
        vNements(where: { metaQuery: { metaArray: [{ key: "festival_id", value: $festivalId, compare: EQUAL_TO }] } }, first: 100) {
            nodes {
                databaseId
                title
                slug
                detailsEvenement {
                    nomDuLieu
                    dateDeDebut
                    dateDeFin
                    statut
                }
                villes {
                    nodes {
                        name
                        slug
                    }
                }
            }
        }
    }
`;

// ============================================================================
// LOGO MAPPING - URLs des logos par ID
// ============================================================================

const LOGO_MAPPING: Record<string, string> = {
    'jof': 'https://japanconventions.com/wp-content/uploads/2025/08/Japan-Otaku-festival-Logo-1536x1536-1.png',
    'jmw': 'https://japanconventions.com/wp-content/uploads/2025/08/LOGO-JMW-A-carree.png',
    'gc': 'https://japanconventions.com/wp-content/uploads/2025/10/gamer-connection-logo.png',
    'ink': 'https://japanconventions.com/wp-content/uploads/2025/10/logotatouage.jpg',
    'one': 'https://japanconventions.com/wp-content/uploads/2025/10/logoFever.jpg'
};

export function getLogoUrl(logoId: string): string {
    const DEFAULT_LOGO = 'https://japanconventions.com/wp-content/uploads/2025/08/Japan-Otaku-festival-Logo-1536x1536-1-3.png';
    return LOGO_MAPPING[logoId] ?? DEFAULT_LOGO;
}

// ============================================================================
// VISITOR URL MAPPING - URLs des pages visiteur par festival et ville
// Basé sur l'analyse du site officiel japanconventions.com
// ============================================================================

const VISITOR_URL_MAPPING: Record<string, Record<string, string>> = {
    'japan-otaku-festival': {
        'albi': 'https://japanconventions.com/japan-otaku-festival/visiteur-albi/',
        'troyes': 'https://japanconventions.com/japan-otaku-festival/troyes-le-cube/visiteur-troyes/',
        'chambery': 'https://japanconventions.com/japan-otaku-festival/chambery-savoi-expo/visiteur-chambery/',
        'la-roche-sur-yon': 'https://japanconventions.com/japan-otaku-festival/la-roche-sur-yon/visiteur-la-roche-sur-yon/',
        'marseille': 'https://japanconventions.com/japan-otaku-festival/palais-des-sports-marseille/visiteur-marseille/',
        'chalons-en-champagne': 'https://japanconventions.com/japan-otaku-festival/la-capitole-chalon-en-champagne/visiteur-chalon-en-champagne/',
        'chalon-en-champagne': 'https://japanconventions.com/japan-otaku-festival/la-capitole-chalon-en-champagne/visiteur-chalon-en-champagne/',
        'saint-etienne': 'https://japanconventions.com/japan-otaku-festival/', // Page visiteur à créer
    },
    'japan-manga-wave': {
        // À compléter quand les pages visiteur seront créées
    },
    'gamer-connection': {
        'aubagne': 'https://japanconventions.com/gamer-connection/aubagne-centre-des-congres-agora-gamer-connection/',
        'castres': 'https://japanconventions.com/gamer-connection/castres-castres-parc-expo-gamer-connection/',
    },
    'ink-secret': {
        'aubagne': 'https://japanconventions.com/ink-secret/',
        'castres': 'https://japanconventions.com/ink-secret/',
    },
    'one-night-event': {
        // À compléter
    },
    'evenement-a-venir': {
        // Événements futurs
    }
};

/**
 * Récupère l'URL visiteur pour un événement en fonction du festival et de la ville
 * @param festivalSlug - Slug du festival (ex: 'japan-otaku-festival')
 * @param villeSlug - Slug de la ville (ex: 'albi', 'troyes')
 * @returns URL de la page visiteur ou undefined si non trouvée
 */
export function getVisitorUrl(festivalSlug: string, villeSlug: string): string | undefined {
    // Normaliser les slugs (lowercase, sans accents)
    const normalizedFestival = festivalSlug?.toLowerCase() || '';
    const normalizedVille = villeSlug?.toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "") // Enlever accents
        .replace(/\s+/g, '-') || '';

    // Chercher dans le mapping
    const festivalMapping = VISITOR_URL_MAPPING[normalizedFestival];
    if (festivalMapping) {
        // Essayer correspondance exacte d'abord
        if (festivalMapping[normalizedVille]) {
            return festivalMapping[normalizedVille];
        }
        // Essayer correspondance partielle (ex: "chalon" dans "chalons-en-champagne")
        for (const [key, url] of Object.entries(festivalMapping)) {
            if (key.includes(normalizedVille) || normalizedVille.includes(key)) {
                return url;
            }
        }
    }

    // Fallback: construire une URL par défaut
    return undefined;
}

// ============================================================================
// TRANSFORMERS
// ============================================================================

function transformEvenementToFestivalEvent(cpt: CPTEvenement): FestivalEvent {
    return {
        id: `event-${cpt.databaseId}`,
        title: cpt.title,
        slug: cpt.slug,
        uri: `/${cpt.slug}/`,
        city: cpt.villes?.nodes?.[0]?.name || '',
        venue: cpt.detailsEvenement?.nomDuLieu || '',
        dateDebut: cpt.detailsEvenement?.dateDeDebut,
        dateFin: cpt.detailsEvenement?.dateDeFin,
        statut: cpt.detailsEvenement?.statut?.[0],
        urlBilletterie: cpt.detailsEvenement?.urlBilletterie,
        // urlExposant: cpt.detailsEvenement?.urlExposant,
        image: cpt.detailsEvenement?.image?.node?.sourceUrl,
        facebook: cpt.detailsEvenement?.facebook,
        instagram: cpt.detailsEvenement?.instagram
    };
}

function transformEvenement(cpt: CPTEvenement): Evenement {
    return {
        id: cpt.databaseId,
        title: cpt.title,
        slug: cpt.slug,
        lieu: cpt.detailsEvenement?.nomDuLieu || '',
        dateDebut: cpt.detailsEvenement?.dateDeDebut || '',
        dateFin: cpt.detailsEvenement?.dateDeFin || '',
        statut: cpt.detailsEvenement?.statut?.[0] || 'a_venir',
        billetterieUrl: cpt.detailsEvenement?.urlBilletterie,
        ville: cpt.villes?.nodes?.[0]?.name || '',
        festivalId: cpt.detailsEvenement?.festival?.nodes?.[0]?.databaseId
    };
}

// ============================================================================
// SERVICE FUNCTIONS
// ============================================================================

// Cache mémoire simple (persiste durant la session client)
let festivalsCache: Festival[] | null = null;
let pressCache: PressArticle[] | null = null;

async function getAllFestivalsWithEvents(client: GraphQLClient): Promise<Festival[]> {
   
    if (festivalsCache) {
        console.log('[CPTService] Retour du cache mémoire');
        return festivalsCache;
    }

    console.log('[CPTService] Fetch des données depuis WordPress...');

    try {
       
        const [hubResponse, pagesResponse] = await Promise.all([
            client.query<{ festivals: { nodes: CPTFestival[] }, vNements: { nodes: CPTEvenement[] } }>(GET_HUB_DATA),
            client.query<{ pages: { nodes: any[] } }>(GET_PAGES_HIERARCHY)
        ]);

        console.log('[CPTService] Réponse GraphQL reçue:', {
            festivalsCount: hubResponse?.festivals?.nodes?.length || 0,
            eventsCount: hubResponse?.vNements?.nodes?.length || 0
        });

        if (!hubResponse || !hubResponse.festivals || !hubResponse.vNements) {
            console.error('[CPTService] Données manquantes dans la réponse GraphQL');
            return [];
        }

        const festivals = hubResponse.festivals.nodes;
        const evenements = hubResponse.vNements.nodes;
        const pages = pagesResponse.pages?.nodes || [];

        const result = festivals
            .filter(f => f.title) // On garde tout ce qui a un titre
            .map(festival => {
                const logoId = festival.detailsFestival?.idLogo?.[0] || 'jof';
                const festivalSlug = festival.slug;

                // Trouver la page racine du festival pour explorer ses enfants
                const festivalPage = pages.find(p => p.slug === festivalSlug);
                const cityPages = festivalPage?.children?.nodes || [];

                // Filtrer les événements de ce festival
                const festivalEvents = evenements
                    .filter(e => {
                        // Matching par ID ACF
                        const eventFestivalId = e.detailsEvenement?.festival?.nodes?.[0]?.databaseId;
                        if (eventFestivalId) return eventFestivalId === festival.databaseId;

                        // Fallback par slug
                        const eventSlug = (e.slug || '').toLowerCase();
                        const festSlugPart = (festivalSlug || '').replace('japan-', '').replace('-festival', '');
                        const eventTitle = (e.title || '').toLowerCase();
                        const festivalTitle = (festival.title || '').toLowerCase();

                        return (eventSlug && festSlugPart && eventSlug.includes(festSlugPart)) ||
                            (eventTitle && festivalTitle && eventTitle.includes(festivalTitle));
                    })
                    .map(e => {
                        const eventData = transformEvenementToFestivalEvent(e);

                        // LOGIQUE DE MAPPING DES URLs VISITEUR
                        // Utilise le mapping statique basé sur l'analyse du site officiel
                        const citySlug = e.villes?.nodes?.[0]?.slug || '';

                        // Priorité 1: URL du CPT (si remplie dans WordPress)
                        // Priorité 2: Mapping statique basé sur festival+ville
                        // Priorité 3: URL par défaut
                        const mappedVisitorUrl = getVisitorUrl(festivalSlug, citySlug);

                        return {
                            ...eventData,
                            urlBilletterie: eventData.urlBilletterie || mappedVisitorUrl || `https://japanconventions.com/${festivalSlug}/`,
                            // urlExposant sera géré dans une prochaine étape
                            urlExposant: eventData.urlExposant
                        };
                    });

                // Récupération sécurisée de la couleur
                const rawColor = festival.detailsFestival?.color;
                const festivalColor = Array.isArray(rawColor) ? rawColor[0] : (rawColor || '#e60012');

                return {
                    id: `festival-${festival.slug}`,
                    name: festival.title,
                    slug: festival.slug,
                    path: `/${festival.slug}`,
                    logo: getLogoUrl(logoId),
                    color: festivalColor,
                    // @ts-ignore
                    exposantUrl: festival.detailsFestival?.urlExposant,
                    // @ts-ignore
                    visiteurUrl: festival.detailsFestival?.urlBilletterie,
                    events: festivalEvents
                };
            });

        // Ordonner les festivals pour le Bento Grid
        // Index 0 et 3 sont des cartes larges (span 8)
        const orderMap: Record<string, number> = {
            'japan-otaku-festival': 0,
            'gamer-connection': 1,
            'ink-secret': 2,
            'japan-manga-wave': 3,
            'evenement-a-venir': 4
        };

        const sortedResult = result.sort((a, b) => {
            const orderA = orderMap[a.slug] ?? 99;
            const orderB = orderMap[b.slug] ?? 99;
            return orderA - orderB;
        });

        // Mise en cache
        console.log('[CPTService] Festivals chargés et ordonnés:', sortedResult.map(f => f.name));
        festivalsCache = sortedResult;
        return sortedResult;
    } catch (error) {
        console.error('[CPTService] Erreur lors de la récupération des festivals:', error);
        throw error;
    }
}

async function getFestivalBySlug(client: GraphQLClient, slug: string): Promise<Festival | null> {
    // On utilise les données du Hub pour tout le monde (rapidité maximale 🚀)
    const allFestivals = await getAllFestivalsWithEvents(client);
    return allFestivals.find(f => f.slug === slug) || null;
}

async function getAllEvenements(client: GraphQLClient): Promise<FestivalEvent[]> {
    // On extrait tous les événements de tous les festivals
    const festivals = await getAllFestivalsWithEvents(client);
    return festivals.flatMap(f => f.events);
}

async function getEvenementsByFestival(client: GraphQLClient, festivalSlug: string): Promise<FestivalEvent[]> {
    const festivals = await getAllFestivalsWithEvents(client);
    const festival = festivals.find(f => f.slug === festivalSlug);
    return festival?.events || [];
}

async function getPressArticles(client: GraphQLClient, first: number = 10): Promise<PressArticle[]> {
    if (pressCache) return pressCache;

    const response = await client.query<{ posts: { nodes: any[] } }>(GET_POSTS, { first });
    const result = response.posts.nodes.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        date: post.date,
        excerpt: post.excerpt?.replace(/<[^>]*>/g, '') || '',
        featuredImage: post.featuredImage,
        categories: post.categories?.nodes || [],
        url: post.uri
    }));

    pressCache = result;
    return result;
}

// ============================================================================
// EXPORT SERVICE
// ============================================================================

export function createCPTService() {
    const client = createGraphQLClient();

    return {
        getAllFestivals: () => getAllFestivalsWithEvents(client),
        getFestivalBySlug: (slug: string) => getFestivalBySlug(client, slug),
        getAllEvenements: () => getAllEvenements(client),
        getEvenementsByFestival: (festivalSlug: string) => getEvenementsByFestival(client, festivalSlug),
        getPressArticles: (first?: number) => getPressArticles(client, first),
        getLogoUrl
    };
}
