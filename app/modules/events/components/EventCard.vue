<template>
  <article class="event-card" :class="{ 'event-card--past': event.isPast }">
    <!-- Image de l'événement -->
    <div class="event-card__image">
      <img 
        v-if="event.featuredImage?.node?.sourceUrl" 
        :src="event.featuredImage.node.sourceUrl" 
        :alt="event.featuredImage.node.altText || event.title"
        loading="lazy"
      />
      <div v-else class="event-card__image-placeholder">
        <span>{{ getInitials(event.title) }}</span>
      </div>
      
      <!-- Badge "À venir" -->
      <div v-if="event.daysUntil && event.daysUntil <= 30" class="event-card__badge">
        {{ event.daysUntil === 1 ? 'Demain !' : `Dans ${event.daysUntil} jours` }}
      </div>
    </div>

    <!-- Informations de l'événement -->
    <div class="event-card__info">
      <h3 class="event-card__city">{{ event.eventDetails?.city || 'Ville à confirmer' }}</h3>
      
      <div class="event-card__details">
        <p class="event-card__venue">
          <span class="icon">📍</span>
          {{ event.eventDetails?.venue || 'Lieu à confirmer' }}
        </p>
        <p class="event-card__date">
          <span class="icon">📅</span>
          {{ event.formattedDate || 'Date à confirmer' }}
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div class="event-card__actions">
      <NuxtLink 
        :to="event.eventDetails?.exposantUrl || `/events/${event.slug}/exposant`" 
        class="event-card__btn event-card__btn--primary"
      >
        Entrée exposant
      </NuxtLink>
      <NuxtLink 
        :to="event.eventDetails?.visiteurUrl || `/events/${event.slug}/visiteur`" 
        class="event-card__btn event-card__btn--secondary"
      >
        Entrée visiteur
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { EventDisplay } from '../types/Event';

interface Props {
  event: EventDisplay;
}

const props = defineProps<Props>();

// Génère les initiales pour le placeholder
const getInitials = (title: string): string => {
  return title
    .split(' ')
    .slice(0, 2)
    .map(word => word.charAt(0).toUpperCase())
    .join('');
};
</script>

<style lang="scss" scoped>
.event-card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }

  &--past {
    opacity: 0.7;
    filter: grayscale(30%);
  }

  // Image section
  &__image {
    position: relative;
    height: 220px;
    overflow: hidden;
    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }

    &:hover img {
      transform: scale(1.05);
    }
  }

  &__image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $primary-color 0%, #c9000f 100%);
    
    span {
      font-size: 3rem;
      font-weight: 800;
      color: white;
      text-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
    }
  }

  &__badge {
    position: absolute;
    top: 12px;
    right: 12px;
    background: linear-gradient(135deg, #00c853, #00e676);
    color: white;
    padding: 6px 14px;
    border-radius: 20px;
    font-size: 0.75rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    box-shadow: 0 2px 10px rgba(0, 200, 83, 0.3);
  }

  // Info section
  &__info {
    padding: 1.25rem 1.5rem;
    flex-grow: 1;
  }

  &__city {
    font-size: 1.25rem;
    font-weight: 800;
    color: $secondary-color;
    margin-bottom: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__details {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__venue,
  &__date {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-size: 0.9rem;
    color: #666;
    margin: 0;

    .icon {
      font-size: 1rem;
    }
  }

  // Actions section
  &__actions {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  &__btn {
    display: block;
    width: 100%;
    padding: 0.875rem 1rem;
    border-radius: 8px;
    font-size: 0.875rem;
    font-weight: 700;
    text-align: center;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    cursor: pointer;
    border: none;

    &--primary {
      background: $primary-color;
      color: white;

      &:hover {
        background: #cc000e; // darken($primary-color, 8%)
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(230, 0, 18, 0.4);
      }
    }

    &--secondary {
      background: transparent;
      color: $primary-color;
      border: 2px solid $primary-color;

      &:hover {
        background: $primary-color;
        color: white;
      }
    }
  }
}
</style>
