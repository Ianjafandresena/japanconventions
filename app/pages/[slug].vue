<template>
  <div class="festival-page" :style="buttonAccentStyles">
    <!-- Hero Section -->
    <section class="hero-section" :style="{ '--festival-color': festivalData?.color || '#e60012' }">
      <div class="hero-mesh"></div>
      <div class="hero-noise"></div>
      
      <div class="container hero-container">
        <!-- Breadcrumb -->
        <nav class="breadcrumb" v-motion-fade>
          <NuxtLink to="/">ACCUEIL</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" class="separator" />
          <span class="current">{{ festivalData?.name || 'FESTIVAL' }}</span>
        </nav>

        <div class="hero-content" v-motion-slide-top>
          <div class="festival-badge" v-motion-pop :delay="400">SAISON 2025/2026</div>
          <h1 class="festival-title">
            {{ festivalData?.name?.split(' ')[0] }} <br/>
            <span>{{ festivalData?.name?.split(' ').slice(1).join(' ') }}</span>
          </h1>
          
          <div class="festival-stats" v-motion-fade :delay="600">
            <div class="stat-item">
              <Icon name="lucide:map-pin" size="18" />
              <span>{{ festivalData?.events?.length || 0 }} DESTINATIONS</span>
            </div>
            <div class="stat-separator"></div>
            <div class="stat-item">
              <Icon name="lucide:users" size="18" />
              <span>COMMUNAUTÉ ACTIVE</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Decorative Elements -->
      <div class="hero-scroll" v-motion-fade :delay="1000">
        <div class="mouse"></div>
      </div>
    </section>

    <!-- Events Section -->
    <section class="events-section">
      <div class="container">
        <div class="section-header" v-motion-fade-visible>
          <div class="header-badge">AGENDA</div>
          <h2 class="section-title">PROCHAINES <br/><span>DESTINATIONS</span></h2>
          <p class="section-desc">Retrouvez toutes les dates et lieux de rassemblement pour cette saison.</p>
        </div>

        <!-- Loading & Error States -->
        <div v-if="pending" class="loading-state">
          <div class="loading-spinner"></div>
          <p>Localisation des événements...</p>
        </div>

        <div v-else-if="error" class="error-state">
          <Icon name="lucide:wifi-off" size="48" class="text-primary" />
          <p>Impossible de charger les données.</p>
          <button @click="() => refresh()" class="btn btn--primary">RÉESSAYER</button>
        </div>

        <!-- Events Grid -->
        <div v-else class="events-grid">
          <article 
            v-for="(event, index) in festivalData?.events" 
            :key="event.id"
            class="event-card glass"
            v-motion
            :initial="{ opacity: 0, y: 30, scale: 0.95 }"
            :visible="{ opacity: 1, y: 0, scale: 1, transition: { delay: index * 100, duration: 800 } }"
          >
            <div class="event-card__visual" :style="{ background: festivalData?.color || '#e60012' }">
              <div class="visual-pattern"></div>
              <div class="visual-city">{{ event.city }}</div>
              <div class="visual-glow"></div>
            </div>

            <div class="event-card__body">
              <div class="event-meta">
                <div class="event-tag">OFFICIEL</div>
                <div class="event-venue">
                  <Icon name="lucide:building-2" size="14" />
                  {{ event.venue || 'Lieu à confirmer' }}
                </div>
              </div>
              <h3 class="event-name">{{ event.city }}</h3>
              
              <div class="event-actions">
                <NuxtLink :to="`${event.uri}exposant/`" class="btn btn--ghost btn--sm">
                  EXPOSANT
                </NuxtLink>
                <NuxtLink :to="`${event.uri}visiteur/`" class="btn btn--neon btn--sm">
                  BILLETERIE
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

// Helper initials
const getInitials = (name: string): string => {
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 3);
};

// Button accent styles
const buttonAccentStyles = computed(() => {
  const hex = festivalData.value?.color || '#e60012';
  // Simple hex to rgb conversion
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return {
    '--btn-accent': hex,
    '--btn-accent-rgb': `${r}, ${g}, ${b}`
  };
});
</script>

<style lang="scss" scoped>
// Hero Section
.hero-section {
  padding: 10rem 0 6rem;
  position: relative;
  overflow: hidden;
  min-height: 80vh;
  display: flex;
  align-items: center;
  background: $background-color;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 50% 50%, rgba(var(--festival-color-rgb), 0.15) 0%, transparent 70%);
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
    &:hover { opacity: 1; color: var(--festival-color); }
  }

  .separator { opacity: 0.3; }
  .current { color: var(--festival-color); }
}

.festival-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 2rem;
}

.festival-title {
  font-size: clamp(3rem, 10vw, 6rem);
  line-height: 0.9;
  margin-bottom: 3rem;
  color: white;
  text-transform: uppercase;

  span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
  }
}

.festival-stats {
  display: flex;
  align-items: center;
  gap: 2rem;
  
  @media (max-width: $mobile) {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-weight: 800;
  font-size: 0.8rem;
  letter-spacing: 1px;
  color: rgba(255, 255, 255, 0.6);

  i, .icon {
    color: var(--festival-color);
  }
}

.stat-separator {
  width: 1px;
  height: 20px;
  background: rgba(255, 255, 255, 0.1);

  @media (max-width: $mobile) {
    display: none;
  }
}

.hero-scroll {
  position: absolute;
  bottom: 3rem;
  left: 50%;
  transform: translateX(-50%);
  
  .mouse {
    width: 25px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.2);
    border-radius: 15px;
    position: relative;

    &::before {
      content: '';
      width: 4px;
      height: 8px;
      background: var(--festival-color);
      border-radius: 2px;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll-wheel 1.5s infinite;
    }
  }
}

// Events Section
.events-section {
  padding: 8rem 0;
  background: $background-color;
}

.section-header {
  margin-bottom: 5rem;
  text-align: center;
}

.header-badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--festival-color);
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

// Events Grid
.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(360px, 1fr));
  gap: 2rem;
}

// Event Card
.event-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 32px;
  overflow: hidden;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);

  &:hover {
    transform: translateY(-10px);
    border-color: var(--festival-color);
    box-shadow: 0 30px 60px -12px rgba(0, 0, 0, 0.5);

    .event-card__visual .visual-city {
      transform: scale(1.1);
    }
  }

  &__visual {
    height: 200px;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .visual-pattern {
      position: absolute;
      inset: 0;
      background-image: radial-gradient(circle at 2px 2px, rgba(255, 255, 255, 0.15) 1px, transparent 0);
      background-size: 15px 15px;
    }

    .visual-city {
      font-size: 2.5rem;
      font-weight: 900;
      color: white;
      text-transform: uppercase;
      letter-spacing: 4px;
      z-index: 1;
      transition: transform 0.5s ease;
      text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    }

    .visual-glow {
      position: absolute;
      bottom: -50px;
      width: 100%;
      height: 100px;
      background: radial-gradient(ellipse at bottom, rgba(255, 255, 255, 0.2), transparent 70%);
    }
  }

  &__body {
    padding: 2.5rem;
  }
}

.event-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.event-tag {
  font-size: 0.65rem;
  font-weight: 900;
  padding: 0.3rem 0.8rem;
  border: 1px solid var(--festival-color);
  color: var(--festival-color);
  border-radius: 6px;
  letter-spacing: 1.5px;
}

.event-venue {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  font-weight: 700;
  color: rgba(255, 255, 255, 0.4);
}

.event-name {
  font-size: 1.75rem;
  color: white;
  margin-bottom: 2.5rem;
}

.event-actions {
  display: grid;
  grid-template-columns: 1fr 1.2fr;
  gap: 1rem;
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

@keyframes scroll-wheel {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 15px); }
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>

