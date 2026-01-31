<template>
  <div class="cart-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-mesh"></div>
      <div class="hero-noise"></div>
      
      <div class="container hero-container">
        <nav class="breadcrumb" v-motion-fade>
          <NuxtLink to="/">ACCUEIL</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" class="separator" />
          <span class="current">PANIER</span>
        </nav>

        <div class="hero-content" v-motion-slide-top>
          <div class="hero-badge" v-motion-pop :delay="400">VOTRE SÉLECTION</div>
          <h1 class="hero-title">
            VOTRE <br/>
            <span>PANIER</span>
          </h1>
          <p class="hero-desc" v-motion-fade :delay="600">
            Finalisez votre commande pour obtenir vos accès exclusifs au Hub Otaku.
          </p>
        </div>
      </div>
    </section>

    <!-- Cart Content -->
    <section class="cart-section">
      <div class="container">
        <div v-if="cart.length === 0" class="empty-cart" v-motion-fade>
          <div class="empty-icon glass">
            <Icon name="lucide:shopping-cart" size="64" />
          </div>
          <h2>VOTRE PANIER EST VIDE</h2>
          <p>Le Hub vous attend, commencez votre voyage dès maintenant.</p>
          <NuxtLink to="/" class="btn btn--neon btn--lg">DÉCOUVRIR LES FESTIVALS</NuxtLink>
        </div>

        <div v-else class="cart-grid">
          <!-- Item List -->
          <div class="items-column">
            <div class="section-title">MES BILLETS ({{ cartCount }})</div>
            
            <div class="cart-items">
              <div 
                v-for="(item, index) in cart" 
                :key="item.id" 
                class="cart-item glass"
                v-motion
                :initial="{ opacity: 0, x: -30 }"
                :visible="{ opacity: 1, x: 0, transition: { delay: index * 100 } }"
              >
                <div class="item-visual">
                  <img :src="item.image" :alt="item.festivalName" />
                </div>
                
                <div class="item-info">
                  <div class="item-header">
                    <h3 class="item-title">{{ item.festivalName }}</h3>
                    <button @click="removeItem(item.id)" class="remove-btn" title="Supprimer">
                      <Icon name="lucide:trash-2" size="20" />
                    </button>
                  </div>
                  
                  <div class="item-details">
                    <div class="detail">
                      <Icon name="lucide:map-pin" size="14" />
                      <span>{{ item.city }} <span class="venue">| {{ item.venue }}</span></span>
                    </div>
                    <div class="detail">
                      <Icon name="lucide:calendar" size="14" />
                      <span>{{ formatDate(item.date) }}</span>
                    </div>
                  </div>

                  <div class="item-actions">
                    <div class="quantity-control glass">
                      <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
                      <span class="qty">{{ item.quantity }}</span>
                      <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
                    </div>
                    
                    <div class="item-price">
                      {{ item.price * item.quantity }}€
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Page Actions -->
            <div class="page-actions" v-motion-fade :delay="500">
              <NuxtLink to="/" class="btn btn--ghost">
                <Icon name="lucide:arrow-left" size="18" />
                CONTINUER LES ACHATS
              </NuxtLink>
              <NuxtLink to="/mon-compte" class="btn btn--ghost">
                VOIR MES COMMANDES
                <Icon name="lucide:user" size="18" />
              </NuxtLink>
            </div>
          </div>

          <!-- Summary Sidebar -->
          <div class="summary-column" v-motion-slide-right :delay="200">
            <div class="summary-card glass">
              <div class="summary-title">RÉCAPITULATIF</div>
              
              <div class="summary-lines">
                <div class="summary-line">
                  <span>SOUSTOTAL</span>
                  <span>{{ cartTotal }}€</span>
                </div>
                <div class="summary-line">
                  <span>FRAIS DE SERVICE</span>
                  <span>LIBRE</span>
                </div>
                <div class="total-line">
                  <span>TOTAL</span>
                  <span class="total-amount">{{ cartTotal }}€</span>
                </div>
              </div>

              <div class="summary-note">Livraison, taxes et remises calculées à la caisse.</div>

              <NuxtLink to="/checkout" class="btn btn--primary btn--lg checkout-btn">
                PASSER LA COMMANDE
                <Icon name="lucide:chevron-right" size="18" />
              </NuxtLink>
              
              <div class="secure-badge">
                <Icon name="lucide:shield-check" size="16" />
                PAIEMENT 100% SÉCURISÉ
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Impact Jumbotron -->
    <ImpactJumbotron />
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/modules/cart';

const { cart, cartCount, cartTotal, removeItem, updateQuantity } = useCart();

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  }).toUpperCase();
};

useSeoMeta({
  title: 'Votre Panier - Japan Conventions',
  description: 'Gérez vos billets pour les festivals Japan Otaku.'
});
</script>

<style lang="scss" scoped>
.cart-page {
  background: $background-color;
  min-height: 100vh;
}

// Hero Section
.hero-section {
  padding: 10rem 0 6rem;
  position: relative;
  overflow: hidden;
  background: $background-color;
}

.hero-mesh {
  position: absolute;
  inset: 0;
  background: radial-gradient(circle at 30% 30%, rgba($primary-color, 0.1) 0%, transparent 60%);
  filter: blur(80px);
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
  margin-bottom: 3rem;
  opacity: 0.6;

  a { color: white; &:hover { color: $primary-color; } }
  .current { color: $primary-color; }
}

.hero-badge {
  display: inline-block;
  padding: 0.6rem 1.6rem;
  background: rgba($primary-color, 0.1);
  border: 1px solid rgba($primary-color, 0.2);
  color: $primary-color;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 900;
  letter-spacing: 3px;
  margin-bottom: 2rem;
}

.hero-title {
  font-size: clamp(3.5rem, 12vw, 5rem);
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

// Cart Section
.cart-section {
  padding: 4rem 0 8rem;
}

.empty-cart {
  text-align: center;
  padding: 8rem 2rem;
  
  .empty-icon {
    width: 120px;
    height: 120px;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 3rem;
    border-radius: 30px;
    color: rgba(255,255,255,0.2);
  }

  h2 { font-size: 2.5rem; color: white; margin-bottom: 1.5rem; font-weight: 900; }
  p { color: rgba(255,255,255,0.4); margin-bottom: 3rem; font-size: 1.2rem; }
}

.cart-grid {
  display: grid;
  grid-template-columns: 1fr 380px;
  gap: 4rem;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr;
  }
}

.section-title {
  font-size: 0.85rem;
  font-weight: 900;
  color: rgba(255,255,255,0.3);
  letter-spacing: 3px;
  margin-bottom: 2.5rem;
  text-transform: uppercase;
  border-left: 3px solid $primary-color;
  padding-left: 1rem;
}

.cart-items {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  margin-bottom: 4rem;
}

.cart-item {
  display: flex;
  padding: 2rem;
  gap: 2.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;

  @media (max-width: $tablet) {
    flex-direction: column;
    padding: 1.5rem;
    gap: 1.5rem;
  }

  .item-visual {
    width: 140px;
    height: 140px;
    flex-shrink: 0;
    
    @media (max-width: $tablet) {
      width: 100px;
      height: 100px;
    }

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      filter: drop-shadow(0 0 10px rgba($primary-color, 0.2));
    }
  }

  .item-info {
    flex: 1;
    display: flex;
    flex-direction: column;
  }

  .item-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 1rem;

    .item-title { font-size: 1.4rem; color: white; font-weight: 800; }
    
    .remove-btn {
      background: none;
      border: none;
      color: rgba(255,255,255,0.2);
      cursor: pointer;
      transition: all 0.3s;
      &:hover { color: $primary-color; transform: scale(1.1); }
    }
  }

  .item-details {
    display: flex;
    gap: 2rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;

    .detail {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      font-size: 0.85rem;
      color: rgba(255,255,255,0.5);
      font-weight: 600;

      .venue { opacity: 0.5; font-weight: 400; }
      .lucide { color: $primary-color; }
    }
  }

  .item-actions {
    margin-top: auto;
    display: flex;
    justify-content: space-between;
    align-items: center;

    .quantity-control {
      display: flex;
      align-items: center;
      gap: 1rem;
      padding: 0.5rem 1rem;
      background: rgba(255,255,255,0.05);
      border-radius: 12px;

      button {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        width: 24px;
        opacity: 0.5;
        &:hover { opacity: 1; color: $primary-color; }
      }

      .qty { font-weight: 900; min-width: 20px; text-align: center; font-size: 0.9rem; }
    }

    .item-price {
      font-size: 1.5rem;
      font-weight: 900;
      color: white;
      text-shadow: 0 0 15px rgba(255,255,255,0.1);
    }
  }
}

.page-actions {
  display: flex;
  gap: 1.5rem;
  
  @media (max-width: $tablet) {
    flex-direction: column;
  }
}

// Summary Sidebar
.summary-card {
  padding: 3rem;
  position: sticky;
  top: 120px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 32px;

  .summary-title {
    font-size: 0.8rem;
    font-weight: 900;
    color: white;
    letter-spacing: 3px;
    margin-bottom: 3rem;
  }

  .summary-lines {
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    margin-bottom: 3.5rem;
    padding-bottom: 2.5rem;
    border-bottom: 1px solid rgba(255,255,255,0.05);
  }

  .summary-line {
    display: flex;
    justify-content: space-between;
    font-size: 0.85rem;
    font-weight: 700;
    color: rgba(255,255,255,0.4);
    letter-spacing: 1px;
  }

  .total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
    font-size: 1rem;
    font-weight: 900;
    color: white;

    .total-amount {
      font-size: 2rem;
      color: $primary-color;
      text-shadow: 0 0 20px rgba($primary-color, 0.3);
    }
  }

  .checkout-btn {
    width: 100%;
    margin-bottom: 2rem;
  }

  .summary-note {
    font-size: 0.7rem;
    color: rgba(255, 255, 255, 0.2);
    text-align: center;
    margin-bottom: 2rem;
    font-weight: 700;
  }

  .secure-badge {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
    font-size: 0.7rem;
    font-weight: 800;
    color: rgba(255,255,255,0.2);
    letter-spacing: 1px;
  }
}
</style>
