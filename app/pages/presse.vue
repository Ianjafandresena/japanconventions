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

    <!-- Visual Divider -->
    <div class="industrial-line" aria-hidden="true">
      <div class="line"></div>
      <div class="dot"></div>
      <div class="line"></div>
    </div>

    <!-- Impact Jumbotron -->
    <ImpactJumbotron />
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
// Hero Section
.hero-section {
  padding: 10rem 0 6rem;
  position: relative;
  overflow: hidden;
  min-height: 60vh;
  display: flex;
  align-items: center;
  background: $background-color;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(0, 242, 255, 0.1) 0%, transparent 70%);
  filter: blur(100px);
  z-index: 0;
}

.hero-noise {
    position: absolute;
    inset: 0;
    background-image: $noise-svg;
    opacity: 0.05;
    z-index: 1;
    pointer-events: none;
}

.hero-container {
  position: relative;
  z-index: 10;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 3rem;

  a {
    color: white;
    opacity: 0.5;
    &:hover { opacity: 1; color: $cyan-color; }
  }

  .separator { opacity: 0.3; }
  .current { color: $cyan-color; }
}

.hero-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(0, 242, 255, 0.1);
  border: 1px solid rgba(0, 242, 255, 0.2);
  color: $cyan-color;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(3rem, 10vw, 5rem);
  line-height: 0.9;
  margin-bottom: 2.5rem;
  color: white;
  text-transform: uppercase;

  span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
  }
}

.hero-desc {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 600px;
  line-height: 1.7;
}

// Articles Section
.articles-section {
  padding: 8rem 0;
  background: $background-color;
}

// Articles Grid
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2.5rem;
}

// Article Card
.article-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  display: flex;
  flex-direction: column;

  &:hover {
    transform: translateY(-10px);
    border-color: rgba(230, 0, 18, 0.3);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);

    .article-img {
      transform: scale(1.1);
    }
  }

  &__header {
    height: 240px;
    position: relative;
    overflow: hidden;

    .article-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .article-placeholder {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111;
      color: #333;
    }

    .article-tags {
      position: absolute;
      top: 1.5rem;
      left: 1.5rem;
    }

    .tag {
      background: rgba(0,0,0,0.6);
      backdrop-filter: blur(10px);
      color: white;
      padding: 0.4rem 1rem;
      border-radius: 8px;
      font-size: 0.7rem;
      font-weight: 800;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
  }

  &__body {
    padding: 2.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.article-meta {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
  margin-bottom: 1.5rem;
}

.article-title {
  font-size: 1.4rem;
  color: white;
  line-height: 1.3;
  margin-bottom: 1.5rem;
  font-weight: 800;
}

.article-excerpt {
  font-size: 0.95rem;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  margin-bottom: 2rem;
}

.article-footer {
  margin-top: auto;
}

.read-more {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: $primary-color;
  font-weight: 900;
  font-size: 0.85rem;
  letter-spacing: 1px;
  transition: gap 0.3s ease;

  &:hover {
    gap: 1rem;
  }
}

// Load More
.load-more {
  text-align: center;
  margin-top: 5rem;
}

// Industrial Line
.industrial-line {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding: 4rem 0;
  opacity: 0.1;

  .line { flex: 1; height: 1px; background: white; }
  .dot { width: 4px; height: 4px; background: white; border-radius: 50%; }
}

// States
.loading-state,
.error-state {
  text-align: center;
  padding: 6rem 2rem;
  border-radius: 32px;
}

.loading-spinner {
  width: 50px;
  height: 50px;
  border: 3px solid rgba(255, 255, 255, 0.05);
  border-top-color: $cyan-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 1.5rem;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>

