<template>
  <article class="festival-card" :style="{ '--festival-color': festivalColor }">
    <!-- Logo du festival -->
    <div class="festival-card__logo">
      <img 
        :src="festival.logo" 
        :alt="festival.name"
        loading="lazy"
      />
    </div>

    <!-- Actions -->
    <div class="festival-card__actions">
      <h3 class="festival-card__title">{{ festival.name.toUpperCase() }}</h3>
      
      <div class="btn-group">
        <NuxtLink 
          :to="`${festival.path}exposant/`" 
          class="festival-card__btn festival-card__btn--primary"
        >
          Entrée exposant
        </NuxtLink>
        <NuxtLink 
          :to="`${festival.path}visiteur/`" 
          class="festival-card__btn festival-card__btn--primary"
        >
          Entrée visiteur
        </NuxtLink>
      </div>

      <!-- Nombre d'événements -->
      <p class="festival-card__events-count" v-if="festival.events && festival.events.length > 0">
        <span class="count">{{ festival.events.length }}</span> 
        ville{{ festival.events.length > 1 ? 's' : '' }} programmée{{ festival.events.length > 1 ? 's' : '' }}
      </p>

      <!-- Lien vers la page du festival -->
      <NuxtLink :to="festival.path" class="festival-card__link">
        Voir toutes les dates →
      </NuxtLink>
    </div>
  </article>
</template>

<script setup lang="ts">
import type { Festival } from '../types/Festival';

interface Props {
  festival: Festival;
}

const props = defineProps<Props>();

// Couleur dynamique basée sur le type de festival
const festivalColor = computed(() => {
  const colors: Record<string, string> = {
    'japan-otaku-festival': '#e60012',
    'japan-manga-wave': '#00a8e1',
    'gamer-connection': '#00c853'
  };
  return colors[props.festival.type] || '#e60012';
});
</script>

<style lang="scss" scoped>
.festival-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.12);
  }

  // Logo section
  &__logo {
    padding: 2.5rem 2rem;
    background: #fdfdfd;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 260px;

    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      transition: transform 0.3s ease;
    }
  }

  &:hover &__logo img {
    transform: scale(1.05);
  }

  // Actions section
  &__actions {
    background: var(--festival-color, #e60012);
    padding: 1.75rem;
    text-align: center;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  &__title {
    color: white;
    font-size: 1.1rem;
    font-weight: 800;
    letter-spacing: 1.5px;
    margin: 0;
  }

  .btn-group {
    display: flex;
    gap: 0.75rem;
    justify-content: center;
    flex-wrap: wrap;
  }

  &__btn {
    padding: 0.875rem 1.5rem;
    border-radius: 50px;
    font-weight: 700;
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    text-decoration: none;

    &--primary {
      background: #00a8e1;
      color: white;

      &:hover {
        background: #0090c5;
        color: white;
        transform: translateY(-2px);
        box-shadow: 0 4px 15px rgba(0, 168, 225, 0.4);
      }
    }
  }

  &__events-count {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    margin: 0;

    .count {
      font-weight: 800;
      font-size: 1.1rem;
    }
  }

  &__link {
    color: white;
    font-size: 0.8rem;
    text-decoration: underline;
    opacity: 0.85;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
      color: white;
    }
  }
}
</style>
