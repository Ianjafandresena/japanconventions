/**
 * useFestivals - Composables pour les festivals
 */

import { createFestivalService } from '../services/FestivalService';
import type { Festival, PressArticle } from '../types/Festival';

/**
 * Composable SSR pour récupérer tous les festivals
 */
export const useFestivalsSSR = () => {
    return useAsyncData('all-festivals', async () => {
        const service = createFestivalService();
        return await service.getAllFestivals();
    });
};

/**
 * Composable SSR pour récupérer un festival spécifique par slug
 */
export const useFestivalSSR = (slug: string) => {
    return useAsyncData(`festival-${slug}`, async () => {
        const service = createFestivalService();
        return await service.getFestival(slug);
    });
};

/**
 * Composable SSR pour récupérer les articles de presse
 */
export const usePressArticlesSSR = (first: number = 10) => {
    return useAsyncData('press-articles', async () => {
        const service = createFestivalService();
        return await service.getPressArticles(first);
    });
};

/**
 * Composable réactif pour les festivals (côté client)
 */
export const useFestivals = () => {
    const service = createFestivalService();

    const festivals = ref<Festival[]>([]);
    const pressArticles = ref<PressArticle[]>([]);
    const loading = ref(false);
    const error = ref<Error | null>(null);

    const fetchFestivals = async () => {
        loading.value = true;
        error.value = null;
        try {
            festivals.value = await service.getAllFestivals();
        } catch (e) {
            error.value = e instanceof Error ? e : new Error('Erreur de chargement');
        } finally {
            loading.value = false;
        }
    };

    const fetchPressArticles = async (first?: number) => {
        try {
            pressArticles.value = await service.getPressArticles(first);
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
        fetchPressArticles,
        config: service.getFestivalsConfig()
    };
};
