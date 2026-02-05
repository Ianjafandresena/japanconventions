<template>
  <div class="press-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-mesh"></div>
      <div class="hero-noise"></div>
      
      <div class="container hero-container">
        <nav class="breadcrumb" v-motion-fade>
          <NuxtLink to="/">ACCUEIL</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" class="separator" />
          <span class="current">NEWSROOM</span>
        </nav>

        <div class="hero-content" v-motion-slide-top>
          <div class="hero-badge" v-motion-pop :delay="400">DERNIÈRES ACTUALITÉS</div>
          <h1 class="hero-title">
            LA PRESSE <br/>
            <span>EN PARLE</span>
          </h1>
          <p class="hero-desc" v-motion-fade :delay="600">
            Retrouvez les derniers articles, reportages et interviews de nos festivals à travers la France.
          </p>
        </div>
      </div>
    </section>

    <!-- Articles Section -->
    <section class="articles-section">
      <div class="container">
        <!-- Loading & Error States -->
        <div v-if="pending" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Chargement des actualités...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <Icon name="lucide:alert-circle" size="48" class="text-primary" />
          <p>Erreur de communication avec le serveur.</p>
          <button @click="() => refresh()" class="btn btn--primary btn--sm">RÉESSAYER</button>
        </div>

        <!-- Articles Grid -->
        <div v-else class="articles-grid">
          <article 
            v-for="(article, index) in articles" 
            :key="article.id"
            class="article-card glass"
            v-motion
            :initial="{ opacity: 0, y: 30, scale: 0.95 }"
            :visible="{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 50, duration: 800 } }"
          >
            <!-- Article Image -->
            <div class="article-card__header">
              <NuxtImg 
                v-if="article.featuredImage?.node?.sourceUrl"
                :src="article.featuredImage.node.sourceUrl"
                :alt="article.title"
                width="600"
                height="400"
                format="webp"
                quality="85"
                class="article-img"
              />
              <div v-else class="article-placeholder">
                <Icon name="lucide:newspaper" size="40" />
              </div>
              
              <div class="article-tags" v-if="article.categories?.length > 0">
                <span class="tag">{{ article.categories[0].name }}</span>
              </div>
            </div>

            <!-- Article Content -->
            <div class="article-card__body">
              <div class="article-meta">
                <Icon name="lucide:calendar" size="14" />
                <span>{{ formatDate(article.date) }}</span>
              </div>
              <h2 class="article-title">{{ article.title }}</h2>
              <p class="article-excerpt" v-if="article.excerpt">
                {{ truncateText(article.excerpt, 100) }}
              </p>
              
              <div class="article-footer">
                <NuxtLink :to="article.url" class="read-more">
                  LIRE L'ARTICLE <Icon name="lucide:arrow-right" size="16" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>

        <!-- Load More -->
        <div class="load-more" v-if="articles.length >= 20">
          <button class="btn btn--neon btn--lg">
            CHARGER PLUS
          </button>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
import { usePressArticlesSSR } from '~/modules/festivals';

// SEO Meta
useSeoMeta({
  title: 'La Presse en Parle - Japan Conventions | Articles et Actualités',
  description: 'Retrouvez tous les articles de presse sur Japan Otaku Festival, Japan Manga Wave et Gamer Connection. Actualités, interviews et reportages.',
  ogTitle: 'La Presse en Parle - Japan Conventions',
  ogDescription: 'Les dernières actualités sur nos conventions de culture japonaise',
  twitterCard: 'summary_large_image'
});

// Fetch press articles
const { data, pending, error, refresh } = await usePressArticlesSSR(30);

// Computed
const articles = computed(() => data.value || []);

// Helpers
const formatDate = (dateStr: string): string => {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
};

const truncateText = (text: string, maxLength: number): string => {
  // Remove HTML tags and truncate
  const cleanText = text.replace(/<[^>]*>/g, '').trim();
  if (cleanText.length <= maxLength) return cleanText;
  return cleanText.substring(0, maxLength).trim() + '...';
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/pages/press";
</style>

