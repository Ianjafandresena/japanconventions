<template>
  <section class="impact-jumbotron">
    <div class="jumbotron-bg">
      <div class="mesh-gradient"></div>
    </div>
    
    <div class="container jumbotron-container">
      <div class="glass-card" v-motion-fade-visible>
        <div class="card-content">
          <div class="badge" v-motion-slide-visible-bottom>ÉDITION LIMITÉE</div>
          <h2 class="jumbotron-title" v-motion-slide-visible-top>
            DEVENEZ ACTEUR DE LA <br/>
            <span>CULTURE JAPONAISE</span>
          </h2>
          <p class="jumbotron-text" v-motion-fade-visible>
            Rejoignez une communauté de plus de 200,000 passionnés. Accédez à des contenus exclusifs, des rencontres VIP et des expériences immersives uniques en France.
          </p>
          
          <div class="jumbotron-stats">
            <div class="stat-item" v-for="(stat, i) in stats" :key="i" v-motion-fade-visible :delay="i * 100">
              <div class="stat-value">{{ stat.value }}</div>
              <div class="stat-label">{{ stat.label }}</div>
            </div>
          </div>

          <div class="jumbotron-actions">
            <button class="btn btn--neon btn--lg">
              <Icon name="lucide:user-plus" />
              REJOINDRE LE CLUB
            </button>
            <button class="btn btn--ghost btn--lg">
              NOS PARTENAIRES <Icon name="lucide:arrow-right" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const stats = [
  { value: '15+', label: 'VILLAGES' },
  { value: '500+', label: 'EXPOSANTS' },
  { value: '250K', label: 'VISITEURS' },
  { value: '50+', label: 'INVITÉS' }
];
</script>

<style lang="scss" scoped>
.impact-jumbotron {
  position: relative;
  padding: 10rem 0;
  overflow: hidden;
  background: $background-color;
}

.jumbotron-bg {
  position: absolute;
  inset: 0;
  z-index: 0;

  .mesh-gradient {
    position: absolute;
    inset: 0;
    background: 
      radial-gradient(at 0% 0%, rgba(230, 0, 18, 0.15) 0px, transparent 50%),
      radial-gradient(at 100% 100%, rgba(0, 242, 255, 0.1) 0px, transparent 50%),
      radial-gradient(at 50% 50%, rgba(255, 215, 0, 0.05) 0px, transparent 50%);
    filter: blur(100px);
  }

  .noise-overlay {
    position: absolute;
    inset: 0;
    background-image: $noise-svg;
    opacity: 0.1;
    pointer-events: none;
  }
}

.jumbotron-container {
  position: relative;
  z-index: 10;
  display: flex;
  justify-content: center;
}

.glass-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 40px;
  padding: 5rem;
  max-width: 1000px;
  width: 100%;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: radial-gradient(circle at center, rgba(230, 0, 18, 0.05) 0%, transparent 50%);
    pointer-events: none;
  }

  @media (max-width: $tablet) {
    padding: 3rem 2rem;
    border-radius: 24px;
  }
}

.card-content {
  position: relative;
  z-index: 1;
  text-align: center;
}

.badge {
  display: inline-block;
  padding: 0.5rem 1.5rem;
  background: rgba(230, 0, 18, 0.1);
  border: 1px solid $primary-color;
  color: $primary-color;
  border-radius: 100px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 2px;
  margin-bottom: 2.5rem;
}

.jumbotron-title {
  font-size: clamp(2rem, 6vw, 4rem);
  line-height: 1.1;
  margin-bottom: 2rem;
  color: white;
  font-weight: 900;

  span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255, 255, 255, 0.5);
  }
}

.jumbotron-text {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  max-width: 700px;
  margin: 0 auto 4rem;
  line-height: 1.7;
}

.jumbotron-stats {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  margin-bottom: 4rem;
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  @media (max-width: $mobile) {
    grid-template-columns: repeat(2, 1fr);
  }
}

.stat-item {
  .stat-value {
    font-size: 2.5rem;
    font-weight: 900;
    color: white;
    margin-bottom: 0.5rem;
  }

  .stat-label {
    font-size: 0.7rem;
    font-weight: 800;
    color: $primary-color;
    letter-spacing: 2px;
  }
}

.jumbotron-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;

  @media (max-width: $mobile) {
    flex-direction: column;
  }
}
</style>
