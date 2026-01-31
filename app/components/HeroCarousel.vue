<template>
  <div class="hero-carousel">
    <div class="carousel-container">
      <div 
        v-for="(slide, index) in slides" 
        :key="index"
        class="carousel-slide"
        :class="{ active: currentSlide === index }"
      >
        <div class="slide-background">
          <NuxtImg 
            :src="slide.image" 
            :alt="slide.title"
            class="slide-img"
            format="webp"
            quality="90"
          />
          <div class="slide-overlay"></div>
          <div class="slide-mesh"></div>
        </div>

        <div class="container slide-content-container">
          <div class="slide-content" v-if="currentSlide === index">
            <div class="slide-eyebrow" v-motion-fade :delay="300">
              <span class="dot"></span> {{ slide.eyebrow }}
            </div>
            
            <h1 class="slide-title" v-motion-slide-top :delay="500">
              <span v-html="slide.title"></span>
            </h1>

            <p class="slide-description" v-motion-fade :delay="700">
              {{ slide.description }}
            </p>

            <div class="jumbotron-actions">
            <button class="btn btn--neon btn--lg" style="width: 200px; margin-right: 20px; ">
              <Icon name="lucide:user-plus" />
              REJOINDRE LE CLUB
            </button>
            <button class="btn btn--ghost btn--lg" style="width: 200px; margin-left: 20px;">
              NOS PARTENAIRES <Icon name="lucide:arrow-right" />
            </button>
          </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Navigation -->
    <div class="carousel-nav">
      <button 
        v-for="(_, index) in slides" 
        :key="index"
        class="nav-dot"
        :class="{ active: currentSlide === index }"
        @click="goToSlide(index)"
        :aria-label="'Aller à la slide ' + (index + 1)"
      ></button>
    </div>

    <!-- Scroll Indicator -->
    <div class="scroll-down">
      <div class="mouse"></div>
      <span>EXPLORER</span>
    </div>
  </div>
</template>

<script setup lang="ts">
const currentSlide = ref(0);
const totalSlides = 3;

const slides = [
  {
    image: '/images/heroes/japan_otaku_festival_hero.png',
    eyebrow: 'EN DIRECT : SAISON 2025/2026',
    title: "L'IMMERSION <br/><span class='glitch-text' data-text='JAPAN OTAKU'>JAPAN OTAKU</span>",
    description: 'Le plus grand rassemblement de la culture otaku en France. Cosplay, concerts et exclusivités.',
    cta: 'VOIR LES DATES',
    icon: 'lucide:zap',
    link: '/festivals'
  },
  {
    image: 'https://images.unsplash.com/photo-1540959733332-e94e270b2d42?q=80&w=2070&auto=format&fit=crop', // Tokyo night placeholder
    eyebrow: 'ÉVÉNEMENT MAJEUR',
    title: "JAPAN <br/><span class='glitch-text' data-text='MANGA WAVE'>MANGA WAVE</span>",
    description: 'Découvrez les dernières sorties manga et rencontrez vos auteurs préférés dans une ambiance électrique.',
    cta: 'BILLETERIE',
    icon: 'lucide:ticket',
    link: '/festivals'
  },
  {
    image: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=2070&auto=format&fit=crop', // Gaming placeholder
    eyebrow: 'NOUVELLE EXPÉRIENCE',
    title: "GAMER <br/><span class='glitch-text' data-text='CONNECTION'>CONNECTION</span>",
    description: 'Le rendez-vous incontournable des passionnés de jeux vidéo. Tournois, VR et retro-gaming.',
    cta: 'S\'INSCRIRE',
    icon: 'lucide:gamepad-2',
    link: '/festivals'
  }
];

let interval: any;

const startAutoplay = () => {
  interval = setInterval(() => {
    currentSlide.value = (currentSlide.value + 1) % slides.length;
  }, 6000);
};

const goToSlide = (index: number) => {
  currentSlide.value = index;
  clearInterval(interval);
  startAutoplay();
};

onMounted(() => {
  startAutoplay();
});

onUnmounted(() => {
  clearInterval(interval);
});
</script>

<style lang="scss" scoped>
.hero-carousel {
  position: relative;
  height: 100vh;
  width: 100%;
  overflow: hidden;
  background: $background-color;
}

.carousel-container {
  height: 100%;
  width: 100%;
}

.carousel-slide {
  position: absolute;
  inset: 0;
  opacity: 0;
  visibility: hidden;
  transition: opacity 1s ease, visibility 1s;
  display: flex;
  align-items: center;

  &.active {
    opacity: 1;
    visibility: visible;
    z-index: 10;
  }
}

.slide-background {
  position: absolute;
  inset: 0;
  z-index: 0;

  .slide-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transform: scale(1.05);
    transition: transform 10s linear;
  }

  .active & .slide-img {
    transform: scale(1.2);
  }

  .slide-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      rgba(0, 0, 0, 0.4) 0%,
      rgba(0, 0, 0, 0.2) 50%,
      rgba(5, 5, 5, 1) 100%
    );
  }

  .slide-mesh {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 50% 50%, rgba(230, 0, 18, 0.15) 0%, transparent 70%);
    filter: blur(80px);
  }
}

.slide-content-container {
  position: relative;
  z-index: 20;
  width: 100%;
}

.slide-content {
  max-width: 900px;
  margin: 0 auto;
  text-align: center;
}

.slide-eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 4px;
  color: $primary-color;
  margin-bottom: 2rem;
  text-transform: uppercase;

  .dot {
    width: 8px;
    height: 8px;
    background: $primary-color;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
}

.slide-title {
  font-size: clamp(3rem, 10vw, 7.5rem);
  line-height: 0.9;
  margin-bottom: 2rem;
  color: white;
  font-weight: 900;

  :deep(.glitch-text) {
    position: relative;
    display: inline-block;
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.3);
    
    &::before {
      content: attr(data-text);
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      color: white;
      -webkit-text-stroke: 0;
      clip-path: polygon(0 0, 100% 0, 100% 45%, 0 45%);
    }
  }
}

.slide-description {
  font-size: 1.25rem;
  color: rgba(255, 255, 255, 0.8);
  max-width: 600px;
  margin: 0 auto 3rem;
  line-height: 1.6;
}

.slide-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
}

.carousel-nav {
  position: absolute;
  right: 3rem;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  z-index: 30;

  @media (max-width: $tablet) {
    right: 50%;
    top: auto;
    bottom: 5rem;
    transform: translateX(50%);
    flex-direction: row;
  }

  .nav-dot {
    width: 4px;
    height: 40px;
    background: rgba(255, 255, 255, 0.2);
    border: none;
    border-radius: 2px;
    cursor: pointer;
    transition: all 0.3s ease;
    padding: 0;

    @media (max-width: $tablet) {
      width: 40px;
      height: 4px;
    }

    &:hover {
      background: rgba(255, 255, 255, 0.5);
    }

    &.active {
      background: $primary-color;
      height: 60px;
      box-shadow: 0 0 15px $primary-color;

      @media (max-width: $tablet) {
        width: 60px;
        height: 4px;
      }
    }
  }
}

.scroll-down {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.5);
  font-size: 0.7rem;
  letter-spacing: 2px;
  font-weight: 700;
  text-transform: uppercase;
  z-index: 20;

  .mouse {
    width: 25px;
    height: 40px;
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 15px;
    position: relative;

    &::before {
      content: '';
      width: 4px;
      height: 8px;
      background: $primary-color;
      border-radius: 2px;
      position: absolute;
      top: 8px;
      left: 50%;
      transform: translateX(-50%);
      animation: scroll-wheel 1.5s infinite;
    }
  }
}

@keyframes scroll-wheel {
  0% { opacity: 1; transform: translate(-50%, 0); }
  100% { opacity: 0; transform: translate(-50%, 15px); }
}

@keyframes pulse {
  0% { transform: scale(1); opacity: 1; }
  50% { transform: scale(1.3); opacity: 0.5; }
  100% { transform: scale(1); opacity: 1; }
}
</style>
