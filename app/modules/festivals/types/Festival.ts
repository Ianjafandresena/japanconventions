/**
 * Festival Types - Types pour les festivals
 */

import type { FeaturedImage } from '~/core/types';

// Interface pour un festival
export interface Festival {
    id: string;
    name: string;
    slug: string;
    path: string;
    logo?: string;
    color: string;
    events: FestivalEvent[];
}

// Interface pour un événement (ville)
export interface FestivalEvent {
    id: string;
    title: string;
    slug: string;
    uri: string;
    city: string;
    venue: string;
}

// Interface pour un article de presse
export interface PressArticle {
    id: string;
    title: string;
    slug: string;
    date: string;
    excerpt: string;
    featuredImage?: FeaturedImage;
    categories: Array<{
        name: string;
        slug: string;
    }>;
    url: string;
}

// Interface pour un élément de menu
export interface MenuItem {
    id: string;
    label: string;
    url: string;
    path: string;
}
