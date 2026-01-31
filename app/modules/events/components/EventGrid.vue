<template>
  <div class="event-grid">
    <!-- Header avec titre et statistiques -->
    <div v-if="showHeader" class="event-grid__header">
      <div class="event-grid__title-section">
        <Icon name="lucide:calendar" size="28" class="text-white opacity-80" />
        <h2 class="event-grid__title">{{ title }}</h2>
      </div>
      
      <div v-if="showStats && stats" class="event-grid__stats">
        <div class="stat">
          <span class="stat__value">{{ stats.upcoming }}</span>
          <span class="stat__label">À venir</span>
        </div>
        <div class="stat stat--highlight">
          <span class="stat__value">{{ stats.thisMonth }}</span>
          <span class="stat__label">Ce mois</span>
        </div>
      </div>
    </div>

    <!-- État de chargement -->
    <div v-if="loading" class="event-grid__loading">
      <div class="loading-spinner"></div>
      <p>Chargement des événements...</p>
    </div>

    <!-- Message d'erreur -->
    <div v-else-if="error" class="event-grid__error glass">
      <Icon name="lucide:alert-triangle" size="48" class="text-primary mb-4" />
      <p>{{ error }}</p>
      <button @click="$emit('retry')" class="btn btn--primary btn--sm mt-4">Réessayer</button>
    </div>

    <!-- Liste vide -->
    <div v-else-if="events.length === 0" class="event-grid__empty glass">
      <Icon name="lucide:inbox" size="48" class="opacity-20 mb-4" />
      <p>Aucun événement à afficher pour le moment.</p>
    </div>

    <!-- Grille d'événements -->
    <div v-else class="event-grid__grid" :class="`event-grid__grid--cols-${columns}`">
      <EventCard 
        v-for="event in displayEvents" 
        :key="event.id" 
        :event="event"
      />
    </div>

    <!-- Bouton "Voir plus" -->
    <div v-if="showViewMore && events.length > limit" class="event-grid__footer">
      <NuxtLink to="/events" class="view-more-btn">
        Voir tous les événements
        <span class="arrow">→</span>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { EventDisplay, EventStats } from '../types/Event';
import EventCard from './EventCard.vue';

interface Props {
  events: EventDisplay[];
  title?: string;
  loading?: boolean;
  error?: string | null;
  stats?: EventStats | null;
  columns?: 2 | 3 | 4;
  limit?: number;
  showHeader?: boolean;
  showStats?: boolean;
  showViewMore?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Événements à venir',
  loading: false,
  error: null,
  stats: null,
  columns: 3,
  limit: 6,
  showHeader: true,
  showStats: true,
  showViewMore: true
});

defineEmits<{
  (e: 'retry'): void;
}>();

// Limiter le nombre d'événements affichés
const displayEvents = computed(() => {
  return props.events.slice(0, props.limit);
});
</script>

<style lang="scss" scoped>
.event-grid {
  padding: 2rem 0;

  // Header
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    flex-wrap: wrap;
    gap: 1rem;
  }

  &__title-section {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  &__icon {
    font-size: 1.75rem;
  }

  &__title {
    font-size: 1.75rem;
    font-weight: 800;
    color: $primary-color;
    text-transform: uppercase;
    letter-spacing: 1px;
    margin: 0;
  }

  &__stats {
    display: flex;
    gap: 1.5rem;
  }

  // Grid
  &__grid {
    display: grid;
    gap: 1.5rem;

    &--cols-2 {
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
    }

    &--cols-3 {
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    }

    &--cols-4 {
      grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    }
  }

  // États
  &__loading,
  &__error,
  &__empty {
    text-align: center;
    padding: 5rem 2rem;
    background: rgba(255, 255, 255, 0.02);
    backdrop-filter: blur(10px);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 24px;
  }

  &__loading {
    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 4px solid #e9ecef;
      border-top-color: $primary-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    p {
      color: #666;
      font-size: 1rem;
    }
  }

  &__error {
    .error-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    p {
      color: #dc3545;
      margin-bottom: 1rem;
    }

    .retry-btn {
      background: $primary-color;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-weight: 600;
      cursor: pointer;
      transition: background 0.3s ease;

      &:hover {
        background: #c9000f; // darken($primary-color, 10%)
      }
    }
  }

  &__empty {
    .empty-icon {
      font-size: 3rem;
      display: block;
      margin-bottom: 1rem;
    }

    p {
      color: #666;
    }
  }

  // Footer
  &__footer {
    text-align: center;
    margin-top: 2.5rem;
  }
}

// Stat component
.stat {
  text-align: center;
  padding: 1rem 1.5rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  min-width: 100px;

  &--highlight {
    background: linear-gradient(135deg, $primary-color, #c9000f);
    
    .stat__value,
    .stat__label {
      color: white;
    }
  }

  &__value {
    display: block;
    font-size: 1.5rem;
    font-weight: 800;
    color: $primary-color;
    line-height: 1;
  }

  &__label {
    display: block;
    font-size: 0.7rem;
    color: #666;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    margin-top: 0.25rem;
  }
}

// View more button
.view-more-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: $primary-color;
  color: white;
  border-radius: 50px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 1px;
  font-size: 0.875rem;
  transition: all 0.3s ease;

  &:hover {
    background: #cc000e; // darken($primary-color, 8%)
    color: white;
    transform: translateY(-2px);
    box-shadow: 0 6px 20px rgba(230, 0, 18, 0.35);

    .arrow {
      transform: translateX(5px);
    }
  }

  .arrow {
    transition: transform 0.3s ease;
  }
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}
</style>
