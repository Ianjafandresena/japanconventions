<template>
  <Teleport to="body">
    <div v-if="isDrawerOpen" class="cart-drawer-overlay" @click="closeDrawer">
      <div class="cart-drawer" @click.stop v-motion-slide-right>
        <div class="drawer-header">
          <div class="header-title">
            <Icon name="lucide:shopping-bag" size="24" />
            <h2>VOTRE PANIER</h2>
          </div>
          <button class="close-btn" @click="closeDrawer">
            <Icon name="lucide:x" size="24" />
          </button>
        </div>

        <div class="drawer-content">
          <div v-if="cart.length === 0" class="empty-state">
            <Icon name="lucide:shopping-cart" size="48" />
            <p>VOTRE PANIER EST VIDE</p>
            <button class="btn btn--ghost btn--sm" @click="closeDrawer">RETOUR AU HUB</button>
          </div>

          <div v-else class="items-list">
            <div v-for="item in cart" :key="item.id" class="drawer-item">
              <div class="item-img glass">
                <img :src="item.image" :alt="item.festivalName" />
              </div>
              <div class="item-details">
                <h3>{{ item.festivalName }}</h3>
                <span class="city">{{ item.city }}</span>
                <div class="price-qty">
                  <div class="qty-control">
                    <button @click="updateQuantity(item.id, item.quantity - 1)">-</button>
                    <span>{{ item.quantity }}</span>
                    <button @click="updateQuantity(item.id, item.quantity + 1)">+</button>
                  </div>
                  <span class="price">{{ item.price * item.quantity }}€</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-if="cart.length > 0" class="drawer-footer">
          <div class="total-line">
            <span>SOUSTOTAL</span>
            <span class="amount">{{ cartTotal }}€</span>
          </div>
          <div class="actions">
            <NuxtLink to="/panier" class="btn btn--ghost w-full" @click="closeDrawer">
              VOIR LE PANIER
            </NuxtLink>
            <NuxtLink to="/checkout" class="btn btn--primary w-full" @click="closeDrawer">
              COMMANDER <Icon name="lucide:arrow-right" size="18" />
            </NuxtLink>
          </div>
          <button class="orders-link" @click="goToOrders">
            <Icon name="lucide:history" size="14" /> VOIR MES COMMANDES
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useCart } from '~/modules/cart';
import { useRouter } from 'vue-router';

const { cart, cartTotal, isDrawerOpen, closeDrawer, updateQuantity } = useCart();
const router = useRouter();

const goToOrders = () => {
    closeDrawer();
    router.push('/mon-compte');
};
</script>

<style lang="scss" scoped>
.cart-drawer-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.8);
  backdrop-filter: blur(8px);
  z-index: 2000;
  display: flex;
  justify-content: flex-end;
}

.cart-drawer {
  width: 100%;
  max-width: 450px;
  background: $bg-dark;
  height: 100vh;
  border-left: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  position: relative;
  box-shadow: -20px 0 60px rgba(0, 0, 0, 0.8);

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: $noise-svg;
    opacity: 0.03;
    pointer-events: none;
  }
}

.drawer-header {
  padding: 2.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);

  .header-title {
    display: flex;
    align-items: center;
    gap: 1rem;
    color: white;
    h2 { font-size: 1.1rem; font-weight: 900; letter-spacing: 2px; }
    .lucide { color: $primary-color; }
  }

  .close-btn {
    background: none;
    border: none;
    color: rgba(255, 255, 255, 0.4);
    cursor: pointer;
    transition: all 0.3s;
    &:hover { color: $primary-color; transform: rotate(90deg); }
  }
}

.drawer-content {
  flex: 1;
  overflow-y: auto;
  padding: 2.5rem;

  &::-webkit-scrollbar { width: 4px; }
  &::-webkit-scrollbar-thumb { background: rgba(255, 255, 255, 0.1); border-radius: 10px; }
}

.empty-state {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  gap: 1.5rem;
  color: rgba(255, 255, 255, 0.2);
  h2 { color: white; }
  p { font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; }
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.drawer-item {
  display: flex;
  gap: 1.5rem;

  .item-img {
    width: 80px;
    height: 80px;
    flex-shrink: 0;
    background: rgba(255, 255, 255, 0.02);
    border-radius: 12px;
    padding: 10px;
    img { width: 100%; height: 100%; object-fit: contain; }
  }

  .item-details {
    flex: 1;
    h3 { font-size: 0.95rem; color: white; margin-bottom: 0.3rem; font-weight: 800; }
    .city { font-size: 0.75rem; color: rgba(255, 255, 255, 0.4); font-weight: 700; text-transform: uppercase; }
  }

  .price-qty {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 1rem;
  }

  .qty-control {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    background: rgba(255, 255, 255, 0.05);
    padding: 0.3rem 0.8rem;
    border-radius: 8px;
    button { background: none; border: none; color: white; cursor: pointer; opacity: 0.5; &:hover { opacity: 1; color: $primary-color; } }
    span { font-size: 0.8rem; font-weight: 900; min-width: 15px; text-align: center; }
  }

  .price { font-weight: 900; color: white; }
}

.drawer-footer {
  padding: 2.5rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);

  .total-line {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 2rem;
    font-size: 0.8rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.4);
    .amount { font-size: 1.5rem; color: white; }
  }

  .actions {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-bottom: 1.5rem;
  }

  .w-full { width: 100%; justify-content: center; }

  .orders-link {
    width: 100%;
    background: none;
    border: none;
    padding: 0.5rem;
    color: rgba(255, 255, 255, 0.3);
    font-size: 0.7rem;
    font-weight: 800;
    letter-spacing: 1px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    border-radius: 8px;
    transition: all 0.3s;
    &:hover { color: white; background: rgba(255,255,255,0.02); }
  }
}
</style>
