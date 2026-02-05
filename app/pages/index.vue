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
          <p class="error-detail" v-if="error.message">{{ error.message }}</p>
          <button @click="() => refresh()" class="btn btn--primary">REDÉMARRER</button>
        </div>

        <div v-else class="bento-grid">
          <NuxtLink
            v-for="(festival, index) in festivals" 
            :key="festival.id"
            :to="festival.path"
            class="bento-item"
            :class="[
              `bento-item--${index % 3}`,
              { 'bento-item--last': festivals && index === festivals.length - 1 && index % 3 === 1 }
            ]"
            v-motion
            :initial="{ opacity: 0, scale: 0.95, y: 30 }"
            :visible="{ opacity: 1, scale: 1, y: 0, transition: { delay: index * 100, duration: 800 } }"
            :style="{ '--accent': festival.color }"
          >
            <div class="bento-item__background">
              <img 
                v-if="festival.logo"
                :src="festival.logo"
                :alt="festival.name"
                width="1536"
                height="1536"
                loading="eager"
                fetchpriority="high"
                class="bento-img"
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
                <span class="bento-btn">
                  DÉCOUVRIR <Icon name="lucide:chevron-right" />
                </span>
              </div>
            </div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- Visual Divider -->

    <!-- Cherry Blossoms (Enhanced) -->
    <div class="cherry-blossoms">
      <span v-for="n in 20" :key="n" class="petal" :style="getPetalStyle(n)">🌸</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useFestivalsSSR } from '~/modules/festivals';

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
</script>

<style lang="scss" scoped>
@use "@/assets/scss/pages/home";
</style>
