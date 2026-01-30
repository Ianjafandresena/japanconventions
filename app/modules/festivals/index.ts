/**
 * Module Festivals - Point d'entrée
 */

// Types
export * from './types/Festival';

// Services
export {
    createFestivalService,
    getFestival,
    getAllFestivals,
    getFestivalEvents,
    getPressArticles
} from './services/FestivalService';

// Composables
export {
    useFestivals,
    useFestivalsSSR,
    useFestivalSSR,
    usePressArticlesSSR
} from './composables/useFestivals';
