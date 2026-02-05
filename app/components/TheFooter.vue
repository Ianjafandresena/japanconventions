<template>
  <footer class="footer">
    <div class="footer__mesh"></div>
    <div class="container footer__content">
      <div class="footer__brand">
        <NuxtLink to="/" class="footer__brand-logo">
          <div class="logo-badge">JC</div>
          <span class="logo-text">JAPAN<span class="text-primary">CONVENTIONS</span></span>
        </NuxtLink>
        <p class="footer__tagline">Organisateur leader d'événements culturels japonais et geek en France. Saison 2025/2026.</p>

      </div>

      <div class="footer__links">
        <div class="footer__group">
          <h4>EXPLORER</h4>
          <ul>
            <li><NuxtLink to="/">Festivals</NuxtLink></li>
            <li><NuxtLink to="/presse">Presse</NuxtLink></li>
            <li><NuxtLink to="/recrutement">Recrutement</NuxtLink></li>
          </ul>
        </div>
        <div class="footer__group">
          <h4>SUPPORT</h4>
          <ul>
            <li><NuxtLink to="/panier">Panier</NuxtLink></li>
            <li><NuxtLink to="/aide">Aide & Contact</NuxtLink></li>
            <li><NuxtLink to="/mentions-legales">Légal</NuxtLink></li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer__bottom">
      <div class="container">
        <p>&copy; 2025 JAPAN CONVENTIONS • TOUS DROITS RÉSERVÉS • MADE WITH PASSION</p>
      </div>
    </div>
  </footer>
</template>

<style lang="scss" scoped>
.footer {
  background: $background-color;
  color: white;
  padding: 10rem 0 0;
  position: relative;
  overflow: hidden;

  &__mesh {
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translateX(-50%);
    width: 100%;
    height: 100%;
    background: radial-gradient(circle at 50% 100%, rgba($primary-color, 0.08) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
  }

  &__content {
    display: grid;
    grid-template-columns: 1.5fr 1fr;
    gap: 6rem;
    padding-bottom: 8rem;
    position: relative;
    z-index: 1;

    @media (max-width: $tablet) {
      grid-template-columns: 1fr;
      gap: 4rem;
    }
  }

  &__brand-logo {
    display: flex;
    align-items: center;
    gap: 1rem;
    text-decoration: none;
    color: white;
    margin-bottom: 2.5rem;
    
    .logo-badge {
      background: $primary-color;
      color: white;
      width: 48px;
      height: 48px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 14px;
      font-weight: 900;
      font-size: 1.25rem;
      box-shadow: 0 0 25px rgba(230, 0, 18, 0.4);
    }

    .logo-text {
      font-family: 'Montserrat', sans-serif;
      font-size: 1.5rem;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 2px;
      .text-primary { color: $primary-color; }
    }
  }

  &__tagline {
    opacity: 0.5;
    max-width: 450px;
    margin-bottom: 3rem;
    font-size: 1.1rem;
    line-height: 1.7;
  }

  &__socials {
    display: flex;
    gap: 1.25rem;

    .social-link {
        width: 48px;
        height: 48px;
        border-radius: 14px;
        background: rgba(255, 255, 255, 0.03);
        border: 1px solid rgba(255, 255, 255, 0.08);
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        color: white;
        font-size: 1.2rem;

        &:hover {
            background: $primary-color;
            border-color: transparent;
            transform: translateY(-8px) rotate(5deg);
            box-shadow: 0 10px 25px rgba(230, 0, 18, 0.4);
        }
    }
  }

  &__links {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 3rem;
  }

  &__group {
    h4 {
      margin-bottom: 2.5rem;
      font-size: 0.7rem;
      font-weight: 900;
      letter-spacing: 3px;
      color: white;
      text-transform: uppercase;
      opacity: 0.3;
      position: relative;

      &::after {
        content: '';
        position: absolute;
        bottom: -10px;
        left: 0;
        width: 30px;
        height: 2px;
        background: $primary-color;
      }
    }

    ul {
      list-style: none;
      padding: 0;
      margin: 0;
      
      li {
        margin-bottom: 1.5rem;
        
        a {
          color: white;
          text-decoration: none;
          font-size: 0.9rem;
          font-weight: 800;
          opacity: 0.5;
          transition: all 0.3s ease;
          letter-spacing: 0.5px;

          &:hover {
            opacity: 1;
            color: $primary-color;
            padding-left: 8px;
          }
        }
      }
    }
  }

  &__bottom {
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(10px);
    padding: 3rem 0;
    text-align: center;
    font-size: 0.65rem;
    font-weight: 900;
    letter-spacing: 4px;
    opacity: 0.2;
    border-top: 1px solid rgba(255, 255, 255, 0.03);
  }
}
</style>
