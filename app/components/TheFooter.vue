<template>
  <footer class="footer">
    <div class="container footer__content">
      <div class="footer__brand">
        <NuxtLink to="/" class="footer__logo">
          <span>JAPAN<span class="text-primary">CONVENTIONS</span></span>
        </NuxtLink>
        <p class="footer__tagline">Le rendez-vous incontournable de la culture japonaise en France.</p>
      </div>

      <div class="footer__links">
        <div class="footer__group">
          <h4>Navigation</h4>
          <ul>
            <li><NuxtLink to="/">Accueil</NuxtLink></li>
            <li><NuxtLink to="/japan-manga-wave">Japan Manga Wave</NuxtLink></li>
            <li><NuxtLink to="/japan-otaku-festival">Japan Otaku Festival</NuxtLink></li>
          </ul>
        </div>
        <div class="footer__group">
          <h4>Légal</h4>
          <ul>
            <li><NuxtLink to="/mentions-legales">Mentions Légales</NuxtLink></li>
            <li><NuxtLink to="/confidentialite">Confidentialité</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Japan Conventions. Tous droits réservés.</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: $secondary-color;
  color: white;
  padding: 4rem 0 0;
  margin-top: 5rem;

  &__content {
    display: grid;
    grid-template-columns: 2fr 3fr;
    gap: 4rem;
    padding-bottom: 4rem;

    @media (max-width: $tablet) {
      grid-template-columns: 1fr;
      gap: 2rem;
    }
  }

  &__logo {
    font-weight: 900;
    font-size: 1.5rem;
    color: white;
    margin-bottom: 1rem;
    display: block;
  }

  &__tagline {
    opacity: 0.7;
    max-width: 300px;
  }

  &__links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 2rem;
  }

  &__group {
    h4 {
      margin-bottom: 1.5rem;
      font-size: 1.1rem;
      position: relative;
      padding-bottom: 0.5rem;

      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        width: 30px;
        height: 2px;
        background: $primary-color;
      }
    }

    ul {
      list-style: none;
      
      li {
        margin-bottom: 0.8rem;
        
        a {
          opacity: 0.6;
          &:hover {
            opacity: 1;
            color: $primary-color;
          }
        }
      }
    }
  }

  &__bottom {
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    padding: 1.5rem 0;
    text-align: center;
    font-size: 0.9rem;
    opacity: 0.5;
  }
}
</style>
