<template>
  <div class="home-page">
    <!-- Hero Carousel Section -->
    <HeroCarousel />

    <!-- Bento Festivals Section -->
    <section class="bento-section">
      <div class="container">
        <div class="section-header" v-motion-fade-visible>
          <div class="header-badge">NOS UNIVERS</div>
          <h2 class="section-title">EXPLOREZ LE <br/><span>HUB OTAKU</span></h2>
          <p class="section-desc">Plongez dans les plus grands rassemblements otaku de France.</p>
        </div>

        <div v-if="pending" class="bento-grid loading">
          <div v-for="n in 3" :key="n" class="bento-item skeleton glass"></div>
        </div>

        <div v-else-if="error" class="error-state">
          <Icon name="lucide:wifi-off" size="48" />
          <p>La connexion au Hub a échoué.</p>
          <button @click="() => refresh()" class="btn btn--primary">REDÉMARRER</button>
        </div>

        <div v-else class="bento-grid">
          <article 
            v-for="(festival, index) in festivals" 
            :key="festival.id"
            class="bento-item"
            :class="`bento-item--${index % 3}`"
            v-motion
            :initial="{ opacity: 0, scale: 0.95, y: 30 }"
            :visible="{ opacity: 1, scale: 1, y: 0, transition: { delay: index * 100, duration: 800 } }"
            :style="{ '--accent': festival.color }"
          >
            <div class="bento-item__background">
              <NuxtImg 
                v-if="festival.logo"
                :src="festival.logo"
                :alt="festival.name"
                width="800"
                height="800"
                format="webp"
                quality="85"
              />
            </div>
            
            <div class="bento-item__overlay"></div>
            
            <div class="bento-item__content">
              <div class="bento-item__tag">
                <Icon name="lucide:map-pin" size="14" />
                {{ festival.events.length }} DESTINATIONS
              </div>
              <h3 class="bento-item__title">{{ festival.name }}</h3>
              
              <div class="bento-item__actions">
                <NuxtLink :to="festival.path" class="bento-btn">
                  DÉCOUVRIR <Icon name="lucide:chevron-right" />
                </NuxtLink>
              </div>
            </div>
          </article>

          <article 
            class="bento-item bento-item--news"
            :class="`bento-item--${(festivals?.length || 0) % 3}`"
            v-motion
            :initial="{ opacity: 0, scale: 0.95, y: 30 }"
            :visible="{ opacity: 1, scale: 1, y: 0, transition: { delay: (festivals?.length || 0) * 100, duration: 800 } }"
            style="--accent: #00f2ff"
          >
            <div class="bento-item__background">
              <div class="news-pattern"></div>
            </div>
            <div class="bento-item__overlay"></div>
            <div class="bento-item__content">
              <div class="bento-item__tag">
                <Icon name="lucide:newspaper" size="14" />
                NOUVEAUTÉS
              </div>
              <h3 class="bento-item__title">ACTUALITÉS <br/>& NEWS</h3>
              <div class="bento-item__actions">
                <NuxtLink to="/actualites" class="bento-btn">
                  LIRE LA SUITE <Icon name="lucide:arrow-right" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Visual Divider -->
    <div class="industrial-line" aria-hidden="true">
      <div class="line"></div>
      <div class="dot"></div>
      <div class="line"></div>
    </div>

    <!-- Impact Jumbotron -->
    <ImpactJumbotron />

    <!-- Cherry Blossoms (Enhanced) -->
    <div class="cherry-blossoms">
      <span v-for="n in 20" :key="n" class="petal" :style="getPetalStyle(n)">🌸</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFestivalsSSR } from '~/modules/festivals';
import { computed } from 'vue';

// SEO Optimization
useSeoMeta({
  title: 'Japan Conventions 2025 | L\'Éxpérience Culturelle Nippone Ultimé',
  description: 'Découvrez les plus grandes conventions Japan & Manga en France. Japan Otaku Festival, Japan Manga Wave et Gamer Connection. Réservez vos billets pour 2025.',
  ogTitle: 'Japan Conventions 2025 | L\'Éxpérience Culturelle Nippone Ultimé',
  ogDescription: 'Le plus grand réseau de conventions Otaku en France. Cosplay, Expo, Gaming et Culture Nippone.',
  ogImage: '/images/og-main.jpg',
  ogType: 'website',
  ogLocale: 'fr_FR',
  twitterCard: 'summary_large_image',
  twitterTitle: 'Japan Conventions 2025',
  twitterDescription: 'Plongez dans l\'univers Otaku en France.',
});

// JSON-LD for Search Engines
useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        "@context": "https://schema.org",
        "@type": "Organization",
        "name": "Japan Conventions",
        "url": "https://japanconventions.fr",
        "logo": "https://japanconventions.fr/logo.png",
        "sameAs": [
          "https://facebook.com/japanconventions",
          "https://instagram.com/japanconventions"
        ],
        "description": "Organisateur d'événements culturels japonais et geek en France."
      })
    }
  ],
  link: [
    { rel: 'canonical', href: 'https://japanconventions.fr' }
  ]
});

const { data: festivals, pending, error, refresh } = await useFestivalsSSR();

// Petal styles
const getPetalStyle = (n: number) => {
  const left = Math.random() * 100;
  const duration = 10 + Math.random() * 20;
  const delay = Math.random() * 10;
  const size = 10 + Math.random() * 20;
  const opacity = 0.1 + Math.random() * 0.3;

  return {
    left: `${left}%`,
    animationDuration: `${duration}s`,
    animationDelay: `${delay}s`,
    fontSize: `${size}px`,
    opacity: opacity,
  };
};

const getInitials = (name: string): string => {
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 3);
};
</script>

<style lang="scss" scoped>
@use "sass:color";

.section-header {
  margin-bottom: 5rem;
  text-align: center;
}

.header-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(230, 0, 18, 0.1);
  border: 1px solid rgba(230, 0, 18, 0.2);
  color: $primary-color;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 1.5rem;
}

.section-title {
  font-size: clamp(2.5rem, 5vw, 4rem);
  margin-bottom: 1.5rem;
  color: white;
  line-height: 1.1;

  span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
  }
}

.section-desc {
  opacity: 0.6;
  font-size: 1.1rem;
  color: white;
  max-width: 600px;
  margin: 0 auto;
}

.bento-grid {
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-auto-rows: 250px;
  gap: 1.5rem;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
    grid-auto-rows: 400px;
  }
}

.bento-item {
  position: relative;
  background: $bg-dark;
  border-radius: 24px;
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.05);
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &--0 { grid-column: span 8; grid-row: span 2; }
  &--1 { grid-column: span 4; grid-row: span 1; }
  &--2 { grid-column: span 4; grid-row: span 1; }

  &--news {
    background: radial-gradient(circle at 100% 0%, rgba(0, 242, 255, 0.15) 0%, transparent 50%),
                rgba(255, 255, 255, 0.02);
    
    .news-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(rgba(0, 242, 255, 0.1) 1px, transparent 1px);
      background-size: 20px 20px;
      opacity: 0.3;
      transition: all 0.8s ease;
    }

    &:hover {
      .news-pattern {
        transform: scale(1.1);
        opacity: 0.5;
      }
    }
  }

  @media (max-width: $tablet) {
    grid-column: span 12 !important;
    grid-row: span 1 !important;
  }

  &:hover {
    transform: scale(0.98);
    border-color: var(--accent);
    
    .bento-item__background img {
      transform: scale(1.1);
      filter: saturate(1.2);
    }
  }

  &__background {
    position: absolute;
    inset: 0;
    z-index: 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      opacity: 0.4;
      transition: all 0.8s ease;
    }
  }

  &__overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%);
    z-index: 1;
  }

  &__content {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    padding: 2.5rem;
    z-index: 2;
  }

  &__tag {
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 2.5px;
    color: var(--accent);
    margin-bottom: 1rem;
  }

  &__title {
    font-size: 2rem;
    color: white;
    margin-bottom: 1.5rem;
  }
}

.bento-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: white;
  text-decoration: none;
  font-weight: 800;
  font-size: 0.85rem;
  transition: all 0.3s ease;

  &:hover {
    color: var(--accent);
    gap: 1rem;
  }
}

// Buttons
.btn {
  padding: 1rem 2.5rem;
  border-radius: 12px;
  font-weight: 900;
  text-transform: uppercase;
  letter-spacing: 2px;
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  cursor: pointer;

  &--neon {
    background: white;
    color: black;
    border: none;
    box-shadow: 0 0 20px rgba(255, 255, 255, 0.2);

    &:hover {
      background: $primary-color;
      color: white;
      box-shadow: 0 0 30px rgba(230, 0, 18, 0.4);
      transform: translateY(-5px);
    }
  }

  &--ghost {
    background: transparent;
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: white;

    &:hover {
      border-color: white;
      background: rgba(255, 255, 255, 0.05);
    }
  }

  &--primary {
    background: $primary-color;
    color: white;
    border: none;

    &:hover {
      background: color.adjust($primary-color, $lightness: -5%);
      transform: translateY(-2px);
      box-shadow: 0 8px 16px rgba(230, 0, 18, 0.2);
    }
  }
}

// Loading & Error states
.loading-state,
.error-state {
  text-align: center;
  padding: 6rem 2rem;
  border-radius: 32px;
  max-width: 600px;
  margin: 0 auto;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(0,0,0,0.05);
  border-top-color: $primary-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

// Industrial Divider
.industrial-line {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 4rem 0;
  opacity: 0.1;

  .line { flex: 1; height: 1px; background: white; }
  .dot { width: 4px; height: 4px; background: white; border-radius: 50%; }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

// Cherry Blossoms Animation
.cherry-blossoms {
  position: fixed;
  inset: 0;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;

  .petal {
    position: absolute;
    top: -50px;
    animation: fall linear forwards;
    user-select: none;
    color: white;
  }
}

@keyframes fall {
  to {
    transform: translateY(100vh) rotate(360deg);
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
