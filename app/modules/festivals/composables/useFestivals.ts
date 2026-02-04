import { createCPTService } from '../services/CPTService';
import type { Festival, FestivalEvent } from '../services/CPTService';
import type { PressArticle } from '../types/Festival';

// Ré-export des types pour compatibilité
export type { Festival, FestivalEvent };

/**
 * Composable SSR pour récupérer tous les festivals depuis les CPTs
 */
export const useFestivalsSSR = () => {
    return useAsyncData('all-festivals-v3', async () => {
        const service = createCPTService();
        return await service.getAllFestivals();
    }, {
        // Hydratation ultra-rapide 🏎️
        getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
    });
};

/**
 * Composable SSR pour récupérer un festival spécifique par slug depuis les CPTs
 * Optimisé pour puiser dans le cache du Hub si disponible 🚀
 */
export const useFestivalSSR = (slug: string) => {
    return useAsyncData(`festival-${slug}-v3`, async () => {
        const service = createCPTService();
        return await service.getFestivalBySlug(slug);
    }, {
        getCachedData: (key) => {
            const app = useNuxtApp();
            // 1. Chercher dans son propre cache Nuxt
            const ownData = app.payload.data[key] || app.static.data[key];
            if (ownData) return ownData;

            // 2. LOGIQUE HUB : Chercher dans les données globales du Hub (Formula 1 🚀)
            // Si la home a déjà chargé tous les festivals, on pioche dedans au lieu de faire un fetch
            const hubData = app.payload.data['all-festivals-v3'] as Festival[] | undefined;
            if (hubData) {
                const found = hubData.find(f => f.slug === slug);
                if (found) {
                    console.log(`[Cache Hit] Festival trouvé dans le payload global: ${slug}`);
                    return found;
                }
            }
            return null;
        }
    });
};

/**
 * Composable SSR pour récupérer les articles de presse
 */
export const usePressArticlesSSR = (first: number = 10) => {
    return useAsyncData('press-articles-v3', async () => {
        const service = createCPTService();
        return await service.getPressArticles(first);
    }, {
        getCachedData: (key) => useNuxtApp().payload.data[key] || useNuxtApp().static.data[key]
    });
};

/**
 * Composable réactif pour les festivals (côté client)
 */
export const useFestivals = () => {
    const festivals = ref<Festival[]>([]);
    const pressArticles = ref<PressArticle[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const fetchFestivals = async () => {
        loading.value = true;
        error.value = null;
        try {
            const cptService = createCPTService();
            festivals.value = await cptService.getAllFestivals();
        } catch (e) {
            error.value = e instanceof Error ? e : new Error('Erreur de chargement');
        } finally {
            loading.value = false;
        }
    };

    const fetchPressArticles = async (first?: number) => {
        try {
            const cptService = createCPTService();
            pressArticles.value = await cptService.getPressArticles(first);
        } catch (e) {
            console.error('Error fetching press articles:', e);
        }
    };

    return {
        festivals,
        pressArticles,
        loading,
        error,
        fetchFestivals,
        fetchPressArticles
    };
};
