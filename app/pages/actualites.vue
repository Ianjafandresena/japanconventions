<template>
  <div class="news-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-mesh"></div>
      <div class="hero-noise"></div>
      
      <div class="container hero-container">
        <nav class="breadcrumb" v-motion-fade>
          <NuxtLink to="/">ACCUEIL</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" class="separator" />
          <span class="current">ACTUALITÉS</span>
        </nav>

        <div class="hero-content" v-motion-slide-top>
          <div class="hero-badge" v-motion-pop :delay="400">LE HUB NE DORT JAMAIS</div>
          <h1 class="hero-title">
            NOUVEAUTÉS <br/>
            <span>& NEWS</span>
          </h1>
          <p class="hero-desc" v-motion-fade :delay="600">
            Restez au cœur de l'action. Toutes les dernières annonces, invités et exclusivités de vos festivals préférés.
          </p>
        </div>
      </div>
    </section>

    <!-- News Grid -->
    <section class="news-section">
      <div class="container">
        <!-- Status Indicator -->
        <div class="status-bar" v-motion-fade :delay="800">
          <div class="status-dot"></div>
          <span class="status-text">FLUX EN DIRECT - {{ articles.length }} ARTICLES DÉTECTÉS</span>
        </div>

        <div v-if="pending" class="loading-state">
          <div class="loading-spinner"></div>
          <p>SCANNING NEWS FEED...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <Icon name="lucide:alert-triangle" size="48" class="text-primary" />
          <p>SIGNAL PERDU. CONNEXION AU HUB IMPOSSIBLE.</p>
          <button @click="() => refresh()" class="btn btn--primary">RECONNEXION</button>
        </div>

        <div v-else class="news-grid">
          <article 
            v-for="(article, index) in articles" 
            :key="article.id"
            class="news-card glass"
            v-motion
            :initial="{ opacity: 0, scale: 0.9, y: 50 }"
            :visible="{ opacity: 1, scale: 1, y: 0, transition: { delay: index * 50, duration: 800 } }"
          >
            <div class="news-card__image">
              <NuxtImg 
                v-if="article.featuredImage?.node?.sourceUrl"
                :src="article.featuredImage.node.sourceUrl"
                :alt="article.title"
                width="800"
                height="500"
                format="webp"
                quality="85"
              />
              <div v-else class="news-placeholder">
                <Icon name="lucide:zap" size="48" />
              </div>
              <div class="news-tag" v-if="article.categories && article.categories.length > 0">
                {{ article.categories[0].name }}
              </div>
            </div>

            <div class="news-card__content">
              <div class="news-meta">
                <Icon name="lucide:calendar" size="12" />
                <span>{{ formatDate(article.date) }}</span>
              </div>
              <h2 class="news-title">{{ article.title }}</h2>
              <p class="news-excerpt">{{ truncateText(article.excerpt, 120) }}</p>
              
              <div class="news-footer">
                <NuxtLink :to="article.url" class="news-link">
                  ACCÉDER AU RAPPORT <Icon name="lucide:arrow-right" size="16" />
                </NuxtLink>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>

    <!-- Impact Jumbotron -->
    <ImpactJumbotron />
  </div>
</template>

<script setup lang="ts">
import { usePressArticlesSSR } from '~/modules/festivals';

// SEO Meta
useSeoMeta({
  title: 'Actualités & Nouveautés - Japan Conventions',
  description: 'Suivez toute l\'actualité des festivals Japan Otaku, Japan Manga Wave et Gamer Connection.',
});

// Fetch data
const { data, pending, error, refresh } = await usePressArticlesSSR(30);
const articles = computed(() => data.value || []);

// Helpers
const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  }).toUpperCase();
};

const truncateText = (text: string, length: number) => {
  const clean = text.replace(/<[^>]*>/g, '').trim();
  if (clean.length <= length) return clean;
  return clean.substring(0, length).trim() + '...';
};
</script>

<style lang="scss" scoped>
.news-page {
  background: $bg-dark;
  min-height: 100vh;
}

// Hero Section
.hero-section {
  padding: 12rem 0 8rem;
  position: relative;
  overflow: hidden;
  background: $background-color;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 70% 30%, rgba($cyan-color, 0.15) 0%, transparent 60%);
  filter: blur(100px);
}

.hero-noise {
  position: absolute;
  inset: 0;
  background-image: $noise-svg;
  opacity: 0.03;
  pointer-events: none;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.7rem;
  font-weight: 900;
  letter-spacing: 2px;
  margin-bottom: 4rem;
  opacity: 0.6;

  a { color: white; transition: color 0.3s; &:hover { color: $cyan-color; } }
  .current { color: $cyan-color; }
}

.hero-badge {
  display: inline-block;
  padding: 0.6rem 1.6rem;
  background: rgba($cyan-color, 0.1);
  border: 1px solid rgba($cyan-color, 0.2);
  color: $cyan-color;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 3px;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(3.5rem, 12vw, 6rem);
  line-height: 0.85;
  color: white;
  margin-bottom: 2.5rem;
  font-weight: 900;
  text-transform: uppercase;

  span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.2);
  }
}

.hero-desc {
  max-width: 600px;
  font-size: 1.15rem;
  color: rgba(255,255,255,0.5);
  line-height: 1.7;
}

// Results section
.news-section {
  padding: 4rem 0 10rem;
  background: $bg-dark;
}

.status-bar {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 4rem;
  padding: 1rem 0;
  border-bottom: 1px solid rgba(255,255,255,0.05);

  .status-dot {
    width: 8px;
    height: 8px;
    background: $japan-gold;
    border-radius: 50%;
    box-shadow: 0 0 10px $japan-gold;
    animation: pulse 2s infinite;
  }

  .status-text {
    font-size: 0.7rem;
    font-weight: 900;
    letter-spacing: 2px;
    color: rgba(255,255,255,0.3);
  }
}

.news-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  gap: 3rem;
}

.news-card {
  display: flex;
  flex-direction: column;
  background: rgba(255,255,255,0.02);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255,255,255,0.05);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  overflow: hidden;

  &:hover {
    border-color: $cyan-color;
    transform: translateY(-8px);
    background: rgba(255,255,255,0.04);
    box-shadow: 0 20px 40px rgba(0,0,0,0.4);

    img { transform: scale(1.05); }
  }

  &__image {
    height: 240px;
    position: relative;
    overflow: hidden;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.6s ease;
    }

    .news-placeholder {
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: #111;
      color: #222;
    }

    .news-tag {
      position: absolute;
      top: 1.5rem;
      right: 1.5rem;
      background: $cyan-color;
      color: black;
      padding: 0.4rem 1rem;
      font-size: 0.65rem;
      font-weight: 900;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
  }

  &__content {
    padding: 2.5rem;
    flex: 1;
    display: flex;
    flex-direction: column;
  }
}

.news-meta {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.25rem;
  font-size: 0.7rem;
  font-weight: 800;
  color: rgba(255,255,255,0.3);
  letter-spacing: 2px;
}

.news-title {
  font-size: 1.6rem;
  color: white;
  margin-bottom: 1.5rem;
  line-height: 1.2;
  font-weight: 800;
}

.news-excerpt {
  color: rgba(255,255,255,0.4);
  font-size: 0.95rem;
  line-height: 1.6;
  margin-bottom: 2.5rem;
}

.news-footer {
  margin-top: auto;
}

.news-link {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  color: $cyan-color;
  font-weight: 900;
  font-size: 0.75rem;
  letter-spacing: 2px;
  text-transform: uppercase;
  transition: gap 0.3s;

  &:hover { gap: 1rem; }
}

.loading-state, .error-state {
  text-align: center;
  padding: 10rem 2rem;
}

.loading-spinner {
  width: 40px;
  height: 40px;
  border: 2px solid rgba(255,255,255,0.1);
  border-top-color: $cyan-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 2rem;
}

@keyframes spin { to { transform: rotate(360deg); } }
@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.5); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}

@media (max-width: 768px) {
  .news-grid { grid-template-columns: 1fr; }
}
</style>
