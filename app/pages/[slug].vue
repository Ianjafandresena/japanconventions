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
            <!-- Image de l'événement ou placeholder -->
            <div class="event-card__visual" :style="{ background: event.image ? 'transparent' : (festivalData?.color || '#e60012') }">
              <img 
                v-if="event.image" 
                :src="event.image" 
                :alt="event.city"
                class="visual-img"
              />
              <template v-else>
                <div class="visual-pattern"></div>
                <div class="visual-city">{{ event.city }}</div>
                <div class="visual-glow"></div>
              </template>
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
              
              <!-- Dates de l'événement -->
              <div class="event-dates" v-if="event.dateDebut">
                <Icon name="lucide:calendar" size="14" />
                <span>Du {{ formatDate(event.dateDebut) }} au {{ formatDate(event.dateFin || event.dateDebut) }}</span>
              </div>
              
              <!-- Boutons côte à côte -->
              <div class="event-actions event-actions--row">
                <NuxtLink 
                  :to="event.urlExposant || `${event.uri}exposant/`" 
                  class="btn btn--round btn--sm"
                  target="_blank"
                >
                  Entrée exposant
                </NuxtLink>
                <NuxtLink 
                  :to="event.urlBilletterie || `${event.uri}visiteur/`" 
                  class="btn btn--round btn--sm"
                  target="_blank"
                >
                  Entrée visiteur
                </NuxtLink>
              </div>
              
              <!-- Icônes réseaux sociaux -->
              <div class="event-socials" v-if="event.facebook || event.instagram">
                <a 
                  v-if="event.facebook" 
                  :href="event.facebook" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="social-icon social-icon--facebook"
                  aria-label="Page Facebook"
                >
                  <Icon name="lucide:facebook" size="18" />
                </a>
                <a 
                  v-if="event.instagram" 
                  :href="event.instagram" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  class="social-icon social-icon--instagram"
                  aria-label="Page Instagram"
                >
                  <Icon name="lucide:instagram" size="18" />
                </a>
              </div>
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

// Helper initials
const getInitials = (name: string): string => {
  return name.split(' ').map(word => word.charAt(0)).join('').toUpperCase().slice(0, 3);
};

// Format date for display (ex: "31 janvier")
const formatDate = (dateStr: string): string => {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const months = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 
                  'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
  return `${date.getDate()} ${months[date.getMonth()]}`;
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

// Scroll to events
const scrollToEvents = () => {
  const el = document.querySelector('.events-section');
  if (el) el.scrollIntoView({ behavior: 'smooth' });
};
</script>

<style lang="scss" scoped>
@use "@/assets/scss/pages/festival";
</style>

