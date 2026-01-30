<template>
  <div class="press-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container">
        <nav class="breadcrumb">
          <NuxtLink to="/">Accueil</NuxtLink>
          <span class="separator">›</span>
          <span class="current">La Presse en Parle</span>
        </nav>

        <div class="hero-content">
          <span class="icon">📰</span>
          <h1>La Presse en Parle</h1>
          <p class="subtitle">Retrouvez les derniers articles de presse sur nos événements</p>
        </div>
      </div>
    </section>

    <!-- Articles Section -->
    <section class="articles-section">
      <div class="container">
        <!-- Loading State -->
        <div v-if="pending" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Chargement des articles...</p>
        </div>

        <!-- Error State -->
        <div v-else-if="error" class="error-state">
          <span class="icon">⚠️</span>
          <p>Erreur de chargement des articles</p>
          <button @click="() => refresh()" class="retry-btn">Réessayer</button>
        </div>

        <!-- Empty State -->
        <div v-else-if="articles.length === 0" class="empty-state">
          <span class="icon">📭</span>
          <p>Aucun article disponible pour le moment.</p>
        </div>

        <!-- Articles Grid -->
        <div v-else class="articles-grid">
          <article 
            v-for="(article, index) in articles" 
            :key="article.id"
            class="article-card"
            :style="{ animationDelay: `${index * 0.08}s` }"
          >
            <!-- Article Image -->
            <div class="article-card__image">
              <NuxtImg 
                v-if="article.featuredImage?.node?.sourceUrl"
                :src="article.featuredImage.node.sourceUrl"
                :alt="article.title"
                width="400"
                height="250"
                format="webp"
                quality="80"
                loading="lazy"
              />
              <div v-else class="article-card__placeholder">
                <span>📰</span>
              </div>
              
              <!-- Categories -->
              <div class="article-card__categories" v-if="article.categories?.length > 0">
                <span 
                  v-for="cat in article.categories.slice(0, 2)" 
                  :key="cat.slug"
                  class="category-tag"
                >
                  {{ cat.name }}
                </span>
              </div>
            </div>

            <!-- Article Content -->
            <div class="article-card__content">
              <span class="article-card__date">{{ formatDate(article.date) }}</span>
              <h2 class="article-card__title">{{ article.title }}</h2>
              <p class="article-card__excerpt" v-if="article.excerpt">
                {{ truncateText(article.excerpt, 150) }}
              </p>
              <NuxtLink :to="article.url" class="article-card__link">
                Lire l'article
                <span class="arrow">→</span>
              </NuxtLink>
            </div>
          </article>
        </div>

        <!-- Load More (si pagination nécessaire) -->
        <div class="load-more" v-if="articles.length >= 20">
          <button class="btn btn--outline">
            Charger plus d'articles
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
// Hero Section
.hero-section {
  background: linear-gradient(135deg, #2b2b2b 0%, #1a1a1a 100%);
  padding: 2rem 0 3rem;
  color: white;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  margin-bottom: 2rem;
  opacity: 0.8;

  a {
    color: white;
    text-decoration: none;

    &:hover {
      text-decoration: underline;
    }
  }

  .separator {
    opacity: 0.5;
  }
}

.hero-content {
  text-align: center;

  .icon {
    font-size: 3.5rem;
    display: block;
    margin-bottom: 1rem;
  }

  h1 {
    font-size: 2.5rem;
    font-weight: 900;
    margin: 0 0 0.75rem;
    text-transform: uppercase;
    letter-spacing: 2px;
  }

  .subtitle {
    font-size: 1.1rem;
    opacity: 0.85;
    margin: 0;
  }
}

// Articles Section
.articles-section {
  padding: 4rem 0;
  background: #f8f9fa;
}

// Articles Grid
.articles-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 2rem;
}

// Article Card
.article-card {
  background: white;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  transition: all 0.4s ease;
  animation: fadeInUp 0.5s ease-out forwards;
  opacity: 0;

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 12px 40px rgba(0, 0, 0, 0.12);
  }

  &__image {
    height: 200px;
    overflow: hidden;
    position: relative;
    background: #f0f0f0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  &:hover &__image img {
    transform: scale(1.08);
  }

  &__placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #e9ecef, #dee2e6);

    span {
      font-size: 4rem;
      opacity: 0.4;
    }
  }

  &__categories {
    position: absolute;
    top: 1rem;
    left: 1rem;
    display: flex;
    gap: 0.5rem;
    flex-wrap: wrap;
  }

  .category-tag {
    background: $primary-color;
    color: white;
    padding: 0.3rem 0.75rem;
    border-radius: 4px;
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  &__content {
    padding: 1.5rem;
  }

  &__date {
    font-size: 0.8rem;
    color: #999;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    display: block;
    margin-bottom: 0.5rem;
  }

  &__title {
    font-size: 1.15rem;
    font-weight: 700;
    color: $secondary-color;
    margin: 0 0 0.75rem;
    line-height: 1.4;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__excerpt {
    font-size: 0.9rem;
    color: #666;
    line-height: 1.6;
    margin: 0 0 1rem;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  &__link {
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
    color: $primary-color;
    font-weight: 600;
    font-size: 0.9rem;
    text-decoration: none;
    transition: all 0.3s ease;

    .arrow {
      transition: transform 0.3s ease;
    }

    &:hover {
      color: #c9000f;

      .arrow {
        transform: translateX(5px);
      }
    }
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

// States
.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 5rem 2rem;
  background: white;
  border-radius: 16px;

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

  &:hover {
    background: #c9000f;
  }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

// Load More
.load-more {
  text-align: center;
  margin-top: 3rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 1rem 2rem;
  border-radius: 50px;
  font-weight: 700;
  font-size: 0.9rem;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  transition: all 0.3s ease;
  cursor: pointer;

  &--outline {
    background: transparent;
    color: $primary-color;
    border: 2px solid $primary-color;

    &:hover {
      background: $primary-color;
      color: white;
    }
  }
}
</style>
