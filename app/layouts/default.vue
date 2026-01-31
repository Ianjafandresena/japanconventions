<template>
  <div class="layout">
    <TheHeader />
    <main class="page-content">
      <slot />
    </main>
    <TheFooter />

    <!-- Back to top -->
    <button 
      class="back-to-top" 
      :class="{ 'is-visible': isScrolled }"
      @click="scrollToTop"
    >
      <Icon name="lucide:arrow-up" size="20" />
      <div class="glow"></div>
    </button>
  </div>
</template>

<script setup>
const isScrolled = ref(false);

const handleScroll = () => {
  isScrolled.value = window.scrollY > 500;
};

const scrollToTop = () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

onMounted(() => {
  window.addEventListener('scroll', handleScroll);
});

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});
</script>

<style lang="scss">
.layout {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background: $background-color;
}

.page-content {
  flex: 1;
  padding-top: 80px; // Matching new header height
}

.back-to-top {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  width: 50px;
  height: 50px;
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 1000;
  opacity: 0;
  transform: translateY(20px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  pointer-events: none;

  &.is-visible {
    opacity: 1;
    transform: translateY(0);
    pointer-events: auto;
  }

  &:hover {
    background: $primary-color;
    border-color: transparent;
    box-shadow: 0 0 20px rgba(230, 0, 18, 0.4);

    .glow {
      opacity: 1;
    }
  }

  .glow {
    position: absolute;
    inset: -10px;
    background: radial-gradient(circle, rgba($primary-color, 0.3) 0%, transparent 70%);
    opacity: 0;
    transition: opacity 0.3s ease;
    z-index: -1;
  }
}
</style>
