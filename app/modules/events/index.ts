/**
 * Module Events - Point d'entrée
 * 
 * Exporte tous les éléments publics du module Events.
 * Permet d'importer depuis '~/modules/events' comme un package Java.
 * 
 * Usage:
 * import { useEvents, toDisplayEvent, type Event } from '~/modules/events';
 */

// Types
export * from './types/Event';

// Services (fonctions)
export {
    createEventService,
    getEvents,
    getEventBySlug,
    getEventCount,
    toDisplayEvent,
    calculateStats
} from './services/EventService';

// Composables
export { useEvents, useEventsSSR } from './composables/useEvents';

// Note: Les composants Vue sont auto-importés par Nuxt
// mais peuvent être explicitement importés si nécessaire:
// import EventCard from '~/modules/events/components/EventCard.vue';
// import EventGrid from '~/modules/events/components/EventGrid.vue';
