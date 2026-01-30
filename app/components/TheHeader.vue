<template>
  <header class="header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header__content">
      <NuxtLink to="/" class="header__logo">
        <span class="logo-text">JAPAN<span class="text-primary">CONVENTIONS</span></span>
      </NuxtLink>

      <nav class="header__nav" :class="{ 'is-open': isMobileMenuOpen }">
        <ul class="header__menu">
          <li v-for="item in menuItems" :key="item.path">
            <NuxtLink :to="item.path" class="header__link" @click="isMobileMenuOpen = false">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <NuxtLink to="/mon-compte" class="btn btn--icon" title="Mon Compte">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
        </NuxtLink>
        <button class="header__burger" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Menu">
          <span></span>
          <span></span>
          <span></span>
        </button>
      </div>
    </div>
  </header>
</template>

<script setup>
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { label: 'ACCUEIL', path: '/' },
  { label: 'JAPAN OTAKU FESTIVAL', path: '/japan-otaku-festival' },
  { label: 'JAPAN MANGA WAVE', path: '/japan-manga-wave' },
  { label: 'GAMER CONNECTION', path: '/gamer-connection' },
  { label: 'LA PRESSE EN PARLE', path: '/presse' },
  { label: 'MON COMPTE', path: '/mon-compte' }
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
  })
})
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000;
  padding: 1.5rem 0;
  transition: $standard-transition;
  background: transparent;

  &.is-scrolled {
    padding: 1rem 0;
    background: rgba(255, 255, 255, 0.95);
    backdrop-filter: blur(10px);
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  &__logo {
    font-weight: 900;
    font-size: 1.5rem;
    letter-spacing: -1px;
    color: $secondary-color;
    
    .logo-text {
      display: flex;
      align-items: center;
    }
  }

  &__menu {
    display: flex;
    list-style: none;
    gap: 2rem;

    @media (max-width: $tablet) {
      display: none;
    }
  }

  &__link {
    font-weight: 600;
    font-size: 0.9rem;
    letter-spacing: 0.5px;
    text-transform: uppercase;
    position: relative;

    &::after {
      content: '';
      position: absolute;
      bottom: -5px;
      left: 0;
      width: 0;
      height: 2px;
      background: $primary-color;
      transition: $standard-transition;
    }

    &:hover::after,
    &.router-link-active::after {
      width: 100%;
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1rem;
  }

  &__burger {
    display: none;
    flex-direction: column;
    gap: 6px;
    background: none;
    border: none;
    cursor: pointer;

    span {
      display: block;
      width: 25px;
      height: 2px;
      background: $secondary-color;
      transition: $standard-transition;
    }

    @media (max-width: $tablet) {
      display: flex;
    }
  }

  // Mobile Menu
  &__nav.is-open {
    @media (max-width: $tablet) {
      display: block;
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100vh;
      background: white;
      padding: 5rem 2rem;

      .header__menu {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 2rem;
        
        .header__link {
          font-size: 1.5rem;
        }
      }
    }
  }
}

.btn--icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: $light-gray;
  color: $secondary-color;

  &:hover {
    background: $primary-color;
    color: white;
  }
}
</style>
