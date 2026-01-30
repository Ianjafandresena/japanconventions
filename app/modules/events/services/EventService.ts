/**
 * Event Service - Module Events
 * 
 * Service dédié à la gestion des événements.
 * Encapsule toutes les requêtes GraphQL liées aux events.
 */

import type { NodeList } from '~/core/types';
import type { Event, EventFilters, EventStats, EventDisplay } from '../types/Event';
import { createGraphQLClient, type GraphQLClient } from '~/core/services/GraphQLClient';

// Fragment GraphQL pour les champs Event communs
const EVENT_FIELDS = `
    id
    databaseId
    title
    slug
    date
    content
    excerpt
    featuredImage {
        node {
            sourceUrl
            altText
            mediaDetails {
                width
                height
            }
        }
    }
`;

/**
 * Récupère la liste des événements
 */
export async function getEvents(client: GraphQLClient, filters: EventFilters = {}): Promise<Event[]> {
    const { first = 10, after } = filters;

    const query = `
        query GetEvents($first: Int, $after: String) {
            events(first: $first, after: $after) {
                nodes {
                    ${EVENT_FIELDS}
                }
                pageInfo {
                    hasNextPage
                    endCursor
                }
            }
        }
    `;

    const response = await client.query<{ events: NodeList<Event> }>(query, { first, after });
    return response.events.nodes;
}

/**
 * Récupère un événement par son slug
 */
export async function getEventBySlug(client: GraphQLClient, slug: string): Promise<Event | null> {
    const query = `
        query GetEventBySlug($slug: ID!) {
            event(id: $slug, idType: SLUG) {
                ${EVENT_FIELDS}
            }
        }
    `;

    const response = await client.query<{ event: Event | null }>(query, { slug });
    return response.event;
}

/**
 * Récupère le nombre total d'événements
 */
export async function getEventCount(client: GraphQLClient): Promise<number> {
    const query = `
        query GetEventCount {
            events(first: 100) {
                nodes {
                    id
                }
            }
        }
    `;

    const response = await client.query<{ events: NodeList<{ id: string }> }>(query);
    return response.events.nodes.length;
}

/**
 * Transforme un Event en EventDisplay avec données formatées
 */
export function toDisplayEvent(event: Event): EventDisplay {
    const now = new Date();
    const startDate = event.eventDetails?.startDate
        ? new Date(event.eventDetails.startDate)
        : null;
    const endDate = event.eventDetails?.endDate
        ? new Date(event.eventDetails.endDate)
        : null;

    const isPast = startDate ? startDate < now : false;
    const isUpcoming = startDate ? startDate >= now : true;
    const daysUntil = startDate
        ? Math.ceil((startDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
        : undefined;

    // Formater les dates (ex: "10 & 11 Janvier 2026")
    let formattedDate = '';
    if (startDate && endDate) {
        const startDay = startDate.getDate();
        const endDay = endDate.getDate();
        const month = startDate.toLocaleDateString('fr-FR', { month: 'long' });
        const year = startDate.getFullYear();

        if (startDate.getMonth() === endDate.getMonth()) {
            formattedDate = `${startDay} & ${endDay} ${month} ${year}`;
        } else {
            const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
            formattedDate = `${startDate.toLocaleDateString('fr-FR', options)} - ${endDate.toLocaleDateString('fr-FR', options)}`;
        }
    } else if (startDate) {
        formattedDate = startDate.toLocaleDateString('fr-FR', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    }

    return {
        ...event,
        formattedDate,
        isPast,
        isUpcoming,
        daysUntil: daysUntil && daysUntil > 0 ? daysUntil : undefined
    };
}

/**
 * Calcule les statistiques des événements
 */
export function calculateStats(events: Event[]): EventStats {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    let upcoming = 0;
    let past = 0;
    let thisMonth = 0;

    events.forEach(event => {
        const startDate = event.eventDetails?.startDate
            ? new Date(event.eventDetails.startDate)
            : null;

        if (startDate) {
            if (startDate >= now) {
                upcoming++;
                if (startDate.getMonth() === currentMonth && startDate.getFullYear() === currentYear) {
                    thisMonth++;
                }
            } else {
                past++;
            }
        }
    });

    return {
        total: events.length,
        upcoming,
        past,
        thisMonth
    };
}

/**
 * Créer le service Events (à utiliser dans un composable)
 */
export function createEventService() {
    const client = createGraphQLClient();

    return {
        getEvents: (filters?: EventFilters) => getEvents(client, filters),
        getEventBySlug: (slug: string) => getEventBySlug(client, slug),
        getEventCount: () => getEventCount(client),
        toDisplayEvent,
        calculateStats
    };
}
