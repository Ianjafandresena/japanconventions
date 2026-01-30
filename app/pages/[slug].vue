<template>
  <div class="festival-page">
    <!-- Hero Section -->
    <section class="hero-section" :style="{ '--festival-color': festivalData?.color || '#e60012' }">
      <div class="container">
        <div class="hero-content">
          <!-- Breadcrumb -->
          <nav class="breadcrumb">
            <NuxtLink to="/">Accueil</NuxtLink>
            <span class="separator">›</span>
            <span class="current">{{ festivalData?.name || 'Festival' }}</span>
          </nav>

          <!-- Festival Logo & Title -->
          <div class="festival-header">
            <NuxtImg 
              v-if="festivalData?.logo"
              :src="festivalData.logo"
              :alt="festivalData.name"
              width="180"
              height="180"
              format="webp"
              quality="90"
              class="festival-logo"
            />
            <div v-else class="festival-logo-placeholder">
              {{ getInitials(festivalData?.name || '') }}
            </div>
            <div class="festival-info">
              <h1>{{ festivalData?.name }}</h1>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
      <div class="container">
        <!-- Section Title -->
        <div class="section-header">
          <span class="icon">📍</span>
          <h2>Nos événements</h2>
          <span class="count" v-if="festivalData?.events?.length">
            {{ festivalData.events.length }} ville(s)
          </span>
        </div>

        <!-- Loading State -->
        <div v-if="pending" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Chargement des événements...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <span class="icon">⚠️</span>
          <p>Erreur de chargement des événements</p>
          <button @click="() => refresh()" class="retry-btn">Réessayer</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="!festivalData?.events?.length" class="empty-state">
          <span class="icon">📭</span>
          <p>Aucun événement programmé pour le moment.</p>
          <NuxtLink to="/" class="btn btn--primary">Retour à l'accueil</NuxtLink>
        </div>

        <!-- Events Grid -->
        <div v-else class="events-grid">
          <article 
            v-for="(event, index) in festivalData.events" 
            :key="event.id"
            class="event-card"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <!-- Event Image (stylisé avec couleur du festival) -->
            <div class="event-card__image" :style="{ backgroundColor: festivalData?.color || '#e60012' }">
              <div class="event-card__overlay">
                <span class="festival-badge">{{ getInitials(festivalData?.name || '') }}</span>
              </div>
              <div class="event-card__city-name">
                <span>{{ event.city }}</span>
              </div>
            </div>

            <!-- Event Info -->
            <div class="event-card__content">
              <h3 class="event-card__city">{{ event.city }}</h3>
              <p class="event-card__venue" v-if="event.venue">
                <span class="icon">📍</span>
                {{ event.venue }}
              </p>
            </div>

            <!-- Event Actions -->
            <div class="event-card__actions">
              <NuxtLink 
                :to="`${event.uri}exposant/`" 
                class="btn btn--primary btn--full"
              >
                Entrée exposant
              </NuxtLink>
              <NuxtLink 
                :to="`${event.uri}visiteur/`" 
                class="btn btn--outline btn--full"
              >
                Entrée visiteur
              </NuxtLink>
            </div>
          </article>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useFestivalSSR } from '~/modules/festivals';

// Get the slug from the route
const route = useRoute();
const slug = route.params.slug as string;

// Debug logging
console.log('Festival slug:', slug);

// Fetch festival data (pass slug, not path)
const { data: festivalData, pending, error, refresh } = await useFestivalSSR(slug);

// SEO Meta (dynamic)
useSeoMeta({
  title: computed(() => `${festivalData.value?.name || 'Festival'} - Japan Conventions`),
  description: computed(() => `Découvrez les prochaines dates du ${festivalData.value?.name || 'festival'}. Réservez vos places exposant ou visiteur.`),
  ogTitle: computed(() => festivalData.value?.name || 'Festival'),
  ogImage: computed(() => festivalData.value?.logo || ''),
  twitterCard: 'summary_large_image'
});

// Get initials for badge
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 3);
};
</script>

<style lang="scss" scoped>
// Hero Section
.hero-section {
  background: linear-gradient(135deg, var(--festival-color) 0%, #a00000 100%);
  padding: 2rem 0 3rem;
  color: white;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  opacity: 0.9;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .separator {
    opacity: 0.6;
  }

  .current {
    font-weight: 600;
  }
}

.festival-header {
  display: flex;
  align-items: center;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 768px) {
    flex-direction: column;
    text-align: center;
  }
}

.festival-logo {
  width: 140px;
  height: 140px;
  object-fit: contain;
  background: white;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);
}

.festival-logo-placeholder {
  width: 140px;
  height: 140px;
  background: rgba(255, 255, 255, 0.2);
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.5rem;
  font-weight: 900;
  color: white;
  letter-spacing: 2px;
}

.festival-info {
  h1 {
    font-size: 2.25rem;
    font-weight: 900;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 2px;
  }
}

// Events Section
.events-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

.section-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 2.5rem;
  flex-wrap: wrap;

  .icon {
    font-size: 2rem;
  }

  h2 {
    font-size: 1.75rem;
    font-weight: 800;
    color: $secondary-color;
    margin: 0;
    text-transform: uppercase;
    letter-spacing: 1px;
  }

  .count {
    background: $primary-color;
    color: white;
    padding: 0.35rem 1rem;
    border-radius: 20px;
    font-size: 0.85rem;
    font-weight: 600;
  }
}

// Events Grid
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 2rem;
}

// Event Card
.event-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: all 0.4s ease;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  &__image {
    height: 180px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, $primary-color, #a00000);
  }

  &__overlay {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }

  .festival-badge {
    background: rgba(255, 255, 255, 0.95);
    color: $primary-color;
    padding: 0.35rem 0.75rem;
    border-radius: 6px;
    font-weight: 800;
    font-size: 0.75rem;
    letter-spacing: 1px;
  }

  &__city-name {
    color: white;
    font-size: 1.75rem;
    font-weight: 900;
    text-transform: uppercase;
    letter-spacing: 2px;
    text-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    text-align: center;
    padding: 0 1rem;
  }

  &__content {
    padding: 1.5rem;
  }

  &__city {
    font-size: 1.2rem;
    font-weight: 800;
    color: $secondary-color;
    margin: 0 0 0.5rem;
    text-transform: uppercase;
  }

  &__venue {
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

  &__actions {
    padding: 0 1.5rem 1.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Buttons
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: 8px;
  font-weight: 700;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  text-decoration: none;
  border: 2px solid transparent;
  cursor: pointer;

  &--full {
    width: 100%;
  }

  &--primary {
    background: $primary-color;
    color: white;

    &:hover {
      background: #c9000f;
      color: white;
      transform: translateY(-2px);
    }
  }

  &--outline {
    background: transparent;
    color: $primary-color;
    border-color: $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }
}

// States
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);

  .icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 1.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
    margin-bottom: 1.5rem;
  }
}

.loading-spinner {
  width: 60px;
  height: 60px;
  border: 4px solid #e9ecef;
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

.retry-btn {
  background: $primary-color;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c9000f;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
