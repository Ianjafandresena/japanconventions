<template>
  <header class="header" :class="{ 'is-scrolled': isScrolled }">
    <div class="container header__content">
      <NuxtLink to="/" class="header__logo">
        <div class="logo-badge" v-motion-pop>JC</div>
        <span class="logo-text">JAPAN<span class="text-primary">CONVENTIONS</span></span>
      </NuxtLink>

      <nav class="header__nav" :class="{ 'is-open': isMobileMenuOpen }">
        <ul class="header__menu">
          <li v-for="(item, index) in menuItems" :key="item.path" v-motion-slide-visible-top :delay="index * 100">
            <NuxtLink :to="item.path" class="header__link" @click="isMobileMenuOpen = false">
              {{ item.label }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="header__actions">
        <div class="cart-wrapper">
          <button class="btn btn--icon" @click="toggleDrawer" title="Panier">
            <Icon name="lucide:shopping-basket" size="20" class="text-white" />
          </button>
          <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
        </div>
        <NuxtLink to="/mon-compte" class="btn btn--icon" title="Mon Compte">
          <Icon name="lucide:user" size="20" class="text-white" />
        </NuxtLink>
        <button class="btn btn--icon header__burger" @click="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Menu">
          <Icon :name="isMobileMenuOpen ? 'lucide:x' : 'lucide:menu'" size="24" />
        </button>
      </div>
    </div>
    <CartDrawer />
  </header>
</template>

<script setup lang="ts">
import { useCart } from '~/modules/cart';
import { ref, onMounted } from 'vue';

const { cartCount, toggleDrawer } = useCart();
const isScrolled = ref(false)
const isMobileMenuOpen = ref(false)

const menuItems = [
  { label: 'ACCUEIL', path: '/' },
  { label: 'JAPAN OTAKU FESTIVAL', path: '/japan-otaku-festival' },
  { label: 'JAPAN MANGA WAVE', path: '/japan-manga-wave' },
  { label: 'GAMER CONNECTION', path: '/gamer-connection' },
  { label: 'ACTUALITÉS', path: '/actualites' },
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
  right: 0;
  z-index: 1000;
  height: 80px;
  display: flex;
  align-items: center;
  transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
  background: transparent;

  &.is-scrolled {
    height: 65px;
    background: rgba(5, 5, 5, 0.8);
    backdrop-filter: blur(25px);
    -webkit-backdrop-filter: blur(25px);
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  }

  &__content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }

  &__logo {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    text-decoration: none;
    color: white;

    .logo-badge {
      width: 40px;
      height: 40px;
      background: $primary-color;
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      font-weight: 900;
      font-size: 1.1rem;
      box-shadow: 0 0 20px rgba(230, 0, 18, 0.4);
      transition: transform 0.3s ease;
    }

    &:hover .logo-badge {
      transform: rotate(-5deg) scale(1.1);
    }

    .logo-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.1rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      .text-primary { color: $primary-color; }
    }
  }

  &__nav {
    display: flex;
    align-items: center;
    gap: 2.5rem;

    @media (max-width: $tablet) {
      display: none;
    }
  }

  &__menu {
    display: flex;
    list-style: none;
    gap: 2.5rem;
    margin: 0;
    padding: 0;
  }

  &__link {
    color: white;
    text-decoration: none;
    font-size: 0.75rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 2px;
    opacity: 0.5;
    transition: all 0.3s ease;
    position: relative;
    padding: 0.5rem 0;

    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 0;
      height: 2px;
      background: $primary-color;
      transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
      box-shadow: 0 0 10px $primary-color;
    }

    &:hover, &.router-link-active {
      opacity: 1;
      &::after { width: 100%; }
    }
  }

  &__actions {
    display: flex;
    align-items: center;
    gap: 1.25rem;
  }

  &__burger {
    display: none;

    @media (max-width: $tablet) {
      display: flex;
    }
  }
}

.cart-wrapper {
  position: relative;
  display: flex;
  align-items: center;

  .cart-badge {
    position: absolute;
    top: -8px;
    right: -8px;
    background: $primary-color;
    color: white;
    font-size: 10px;
    font-weight: 900;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 2px solid #050505;
    box-shadow: 0 0 15px rgba($primary-color, 0.4);
    pointer-events: none;
    z-index: 10;
  }
}


.btn--icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 45px;
  height: 45px;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  color: white;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;

  &:hover {
    background: rgba(255, 255, 255, 0.08);
    border-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
}
</style>
