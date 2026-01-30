<template>
  <div class="home-page">
    <!-- Hero Section avec TOUS les festivals depuis WordPress -->
    <section class="hero-section">
      <div class="container">
        <div class="hero-content">
          <!-- Badge Agenda -->
          <div class="hero-badge animate-fadeIn">
            <span class="icon">📅</span>
            <span class="text">AGENDA 2025 - 2026</span>
          </div>

          <!-- Loading State -->
          <div v-if="pending" class="loading-state">
            <div class="loading-spinner"></div>
            <p>Chargement des festivals...</p>
          </div>

          <!-- Error State -->
          <div v-else-if="error" class="error-state">
            <span class="icon">⚠️</span>
            <p>Erreur de chargement</p>
            <button @click="() => refresh()" class="retry-btn">Réessayer</button>
          </div>

          <!-- Festivals Grid - DYNAMIQUE depuis WordPress -->
          <div v-else class="festivals-grid">
            <article 
              v-for="(festival, index) in festivals" 
              :key="festival.id"
              class="festival-card"
              :style="{ 
                '--festival-color': festival.color,
                animationDelay: `${index * 0.12}s` 
              }"
            >
              <NuxtLink :to="festival.path" class="festival-card__link">
                <div class="festival-card__logo">
                  <NuxtImg 
                    v-if="festival.logo"
                    :src="festival.logo"
                    :alt="festival.name"
                    width="400"
                    height="400"
                    format="webp"
                    quality="85"
                    loading="lazy"
                  />
                  <div v-else class="festival-card__logo-placeholder">
                    {{ getInitials(festival.name) }}
                  </div>
                </div>
              </NuxtLink>

              <div class="festival-card__actions">
                <h2 class="festival-card__title">{{ festival.name.toUpperCase() }}</h2>
                
                <div class="btn-group">
                  <NuxtLink 
                    :to="`${festival.path}exposant/`" 
                    class="btn btn--cyan"
                  >
                    Entrée exposant
                  </NuxtLink>
                  <NuxtLink 
                    :to="`${festival.path}visiteur/`" 
                    class="btn btn--cyan"
                  >
                    Entrée visiteur
                  </NuxtLink>
                </div>

                <!-- Nombre de villes -->
                <p class="festival-card__count" v-if="festival.events.length > 0">
                  {{ festival.events.length }} ville(s) programmée(s)
                </p>

                <NuxtLink :to="festival.path" class="festival-card__more">
                  Voir toutes les dates →
                </NuxtLink>
              </div>
            </article>
          </div>
        </div>
      </div>

      <!-- Cherry Blossoms Animation -->
      <div class="cherry-blossoms" aria-hidden="true">
        <span v-for="n in 15" :key="n" class="petal" :style="getPetalStyle(n)">🌸</span>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useFestivalsSSR } from '~/modules/festivals';

// SEO Meta
useSeoMeta({
  title: 'Japan Conventions - Accueil | Conventions Manga, Anime et Jeux Vidéo en France',
  description: 'Découvrez toutes nos conventions : Japan Otaku Festival, Japan Manga Wave, Gamer Connection, Ink Secret et plus. Événements de culture japonaise en France.',
  ogTitle: 'Japan Conventions - Culture Japonaise en France',
  ogDescription: 'Vos événements préférés de culture japonaise arrivent près de chez vous !',
  ogImage: 'https://japanconventions.com/wp-content/uploads/2025/08/Japan-Otaku-festival-Logo-1536x1536-1-3.png',
  twitterCard: 'summary_large_image'
});

// Fetch ALL festivals from WordPress menu
const { data: festivals, pending, error, refresh } = await useFestivalsSSR();

// Get initials for festivals without logo
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map(word => word.charAt(0))
    .join('')
    .toUpperCase()
    .slice(0, 3);
};

// Helper: Random petal style for animation
const getPetalStyle = (index: number) => ({
  left: `${(index * 7) % 100}%`,
  animationDelay: `${(index * 0.4) % 6}s`,
  animationDuration: `${10 + (index % 5)}s`,
  fontSize: `${1.2 + (index % 3) * 0.3}rem`,
  opacity: 0.4 + (index % 4) * 0.1
});
</script>

<style lang="scss" scoped>
// Hero Section
.hero-section {
  background: linear-gradient(135deg, #fafafa 0%, #f0f0f0 100%);
  padding: 3rem 0 4rem;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.hero-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  background: white;
  padding: 0.875rem 1.75rem;
  border-radius: 50px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  margin-bottom: 3rem;

  .icon {
    font-size: 1.5rem;
  }

  .text {
    font-size: 1.35rem;
    font-weight: 800;
    color: $primary-color;
    letter-spacing: 2px;
    text-transform: uppercase;
  }
}

// Animations
.animate-fadeIn {
  animation: fadeIn 0.6s ease-out forwards;
}

@keyframes fadeIn {
  from { opacity: 0; transform: translateY(-10px); }
  to { opacity: 1; transform: translateY(0); }
}

// Festivals Grid
.festivals-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 2rem;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
}

// Festival Card
.festival-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.4s ease, box-shadow 0.4s ease;
  animation: slideUp 0.6s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
  }

  &__link {
    display: block;
  }

  &__logo {
    padding: 2rem;
    background: #fdfdfd;
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 260px;
    transition: background 0.3s ease;

    img {
      max-width: 100%;
      max-height: 200px;
      object-fit: contain;
      transition: transform 0.4s ease;
    }
  }

  &__logo-placeholder {
    width: 150px;
    height: 150px;
    border-radius: 50%;
    background: var(--festival-color, $primary-color);
    color: white;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2.5rem;
    font-weight: 900;
    letter-spacing: 2px;
  }

  &:hover &__logo {
    background: #f8f8f8;
    
    img {
      transform: scale(1.05);
    }
  }

  &__actions {
    background: var(--festival-color, $primary-color);
    padding: 1.75rem;
    text-align: center;
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

  &__count {
    color: rgba(255, 255, 255, 0.9);
    font-size: 0.9rem;
    margin: 0;
  }

  &__more {
    color: white;
    font-size: 0.85rem;
    text-decoration: underline;
    opacity: 0.85;
    transition: opacity 0.3s ease;

    &:hover {
      opacity: 1;
      color: white;
    }
  }
}

@keyframes slideUp {
  from { 
    opacity: 0; 
    transform: translateY(30px); 
  }
  to { 
    opacity: 1; 
    transform: translateY(0); 
  }
}

// Button Group
.btn-group {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.875rem 1.5rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.8rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  text-decoration: none;
  border: none;
  cursor: pointer;

  &--cyan {
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

// Loading & Error states
.loading-state,
.error-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 20px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.08);
}

.loading-state {
  .loading-spinner {
    width: 60px;
    height: 60px;
    border: 4px solid #e9ecef;
    border-top-color: $primary-color;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin: 0 auto 1.5rem;
  }

  p {
    color: #666;
    font-size: 1.1rem;
  }
}

.error-state {
  .icon {
    font-size: 4rem;
    display: block;
    margin-bottom: 1rem;
  }

  p {
    color: #666;
    margin-bottom: 1.5rem;
  }
}

.retry-btn {
  background: $primary-color;
  color: white;
  border: none;
  padding: 0.875rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.3s ease;

  &:hover {
    background: #c9000f;
    transform: translateY(-2px);
  }
}

// Cherry Blossoms Animation
.cherry-blossoms {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
  overflow: hidden;
}

.petal {
  position: absolute;
  top: -60px;
  animation: fall linear infinite;
}

@keyframes fall {
  0% {
    transform: translateY(-20px) rotate(0deg) translateX(0);
    opacity: 0;
  }
  10% {
    opacity: 0.6;
  }
  50% {
    transform: translateY(50vh) rotate(180deg) translateX(50px);
  }
  90% {
    opacity: 0.6;
  }
  100% {
    transform: translateY(110vh) rotate(360deg) translateX(-30px);
    opacity: 0;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
