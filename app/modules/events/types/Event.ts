/**
 * Event Types - Module Events
 * 
 * Définitions des types pour les événements Japan Conventions
 */

import type { BaseEntity, FeaturedImage } from '~/core/types';

// Types d'événements disponibles
export type EventType = 'japan-otaku-festival' | 'japan-manga-wave' | 'gamer-connection' | 'other';

// Détails de l'événement (champs ACF/custom fields)
export interface EventDetails {
    startDate: string;          // Date de début
    endDate: string;            // Date de fin
    city: string;               // Ville (ex: "Castres", "Albi")
    venue: string;              // Lieu (ex: "Parc Expo", "Le Cube")
    address?: string;           // Adresse complète
    exposantUrl?: string;       // Lien vers formulaire exposant
    visiteurUrl?: string;       // Lien vers billetterie visiteur
    eventType?: EventType;      // Type d'événement
}

// Entité Event complète
export interface Event extends BaseEntity {
    content?: string;
    excerpt?: string;
    featuredImage?: FeaturedImage;
    eventDetails?: EventDetails;
    categories?: {
        nodes: Array<{
            id: string;
            name: string;
            slug: string;
        }>;
    };
}

// Event avec données formatées pour l'affichage
export interface EventDisplay extends Event {
    formattedDate: string;      // "10 & 11 Janvier 2026"
    isPast: boolean;            // L'événement est-il passé ?
    isUpcoming: boolean;        // L'événement est-il à venir ?
    daysUntil?: number;         // Nombre de jours avant l'événement
}

// Filtres pour les requêtes d'événements
export interface EventFilters {
    first?: number;
    after?: string;
    eventType?: EventType;
    upcoming?: boolean;         // Seulement les événements à venir
    past?: boolean;             // Seulement les événements passés
}

// Statistiques des événements
export interface EventStats {
    total: number;
    upcoming: number;
    past: number;
    thisMonth: number;
}
