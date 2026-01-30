/**
 * useEvents - Composable du module Events
 * 
 * Interface principale pour utiliser les événements dans les composants Vue.
 * Fournit un accès réactif aux données et aux méthodes du service.
 */

import { createEventService, toDisplayEvent, calculateStats } from '../services/EventService';
import type { Event, EventFilters, EventDisplay, EventStats } from '../types/Event';

export interface UseEventsReturn {
    // Données
    events: Ref<Event[]>;
    loading: Ref<boolean>;
    error: Ref<Error | null>;
    stats: ComputedRef<EventStats>;
    upcomingEvents: ComputedRef<EventDisplay[]>;

    // Méthodes
    fetchEvents: (filters?: EventFilters) => Promise<void>;
    getEventBySlug: (slug: string) => Promise<Event | null>;
    refresh: () => Promise<void>;
}

export const useEvents = (initialFilters: EventFilters = {}): UseEventsReturn => {
    // Créer le service dans le contexte Vue
    const service = createEventService();

    // State réactif
    const events = ref<Event[]>([]);
    const loading = ref<boolean>(false);
    const error = ref<Error | null>(null);
    const currentFilters = ref<EventFilters>(initialFilters);

    // Computed: Statistiques des événements
    const stats = computed<EventStats>(() => {
        return calculateStats(events.value);
    });

    // Computed: Événements à venir formatés pour l'affichage
    const upcomingEvents = computed<EventDisplay[]>(() => {
        return events.value
            .map(event => toDisplayEvent(event))
            .filter(event => event.isUpcoming)
            .sort((a, b) => {
                const dateA = a.eventDetails?.startDate ? new Date(a.eventDetails.startDate).getTime() : 0;
                const dateB = b.eventDetails?.startDate ? new Date(b.eventDetails.startDate).getTime() : 0;
                return dateA - dateB;
            });
    });

    // Méthode: Récupérer les événements
    const fetchEvents = async (filters: EventFilters = {}): Promise<void> => {
        loading.value = true;
        error.value = null;
        currentFilters.value = { ...currentFilters.value, ...filters };

        try {
            events.value = await service.getEvents(currentFilters.value);
        } catch (e) {
            error.value = e instanceof Error ? e : new Error('Erreur lors du chargement des événements');
            console.error('useEvents.fetchEvents:', error.value);
        } finally {
            loading.value = false;
        }
    };

    // Méthode: Récupérer un événement par slug
    const getEventBySlug = async (slug: string): Promise<Event | null> => {
        try {
            return await service.getEventBySlug(slug);
        } catch (e) {
            console.error('useEvents.getEventBySlug:', e);
            return null;
        }
    };

    // Méthode: Rafraîchir les données
    const refresh = async (): Promise<void> => {
        await fetchEvents(currentFilters.value);
    };

    return {
        events,
        loading,
        error,
        stats,
        upcomingEvents,
        fetchEvents,
        getEventBySlug,
        refresh
    };
};

/**
 * useEventsSSR - Version SSR-friendly avec useAsyncData
 * 
 * Utilise useAsyncData pour le rendu côté serveur
 */
export const useEventsSSR = (key: string, filters: EventFilters = {}) => {
    return useAsyncData(key, async () => {
        const service = createEventService();
        const events = await service.getEvents(filters);
        return {
            events,
            stats: calculateStats(events),
            upcomingEvents: events
                .map(event => toDisplayEvent(event))
                .filter(event => event.isUpcoming)
                .sort((a, b) => {
                    const dateA = a.eventDetails?.startDate ? new Date(a.eventDetails.startDate).getTime() : 0;
                    const dateB = b.eventDetails?.startDate ? new Date(b.eventDetails.startDate).getTime() : 0;
                    return dateA - dateB;
                })
        };
    });
};
