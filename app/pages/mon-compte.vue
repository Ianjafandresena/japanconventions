<template>
  <div class="account-page">
    <section class="hero-section">
      <div class="hero-mesh"></div>
      <div class="container">
        <nav class="breadcrumb">
          <NuxtLink to="/">ACCUEIL</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" />
          <span class="current">MON COMPTE</span>
        </nav>
        <h1 class="hero-title">ZONE <span>MEMBRE</span></h1>
      </div>
    </section>

    <section class="account-content">
      <div class="container">
        <div class="account-layout">
          <!-- Sidebar -->
          <aside class="account-nav glass">
            <div class="user-profile">
              <div class="avatar">JC</div>
              <div class="user-info">
                <h3>Otaku Guest</h3>
                <span>ID: #8429</span>
              </div>
            </div>
            
            <nav class="nav-links">
              <button class="nav-btn active">
                <Icon name="lucide:layout-dashboard" size="18" /> TABLEAU DE BORD
              </button>
              <button class="nav-btn">
                <Icon name="lucide:shopping-bag" size="18" /> MES COMMANDES
              </button>
              <button class="nav-btn">
                <Icon name="lucide:ticket" size="18" /> MES BILLETS
              </button>
              <button class="nav-btn">
                <Icon name="lucide:settings" size="18" /> PARAMÈTRES
              </button>
              <div class="nav-divider"></div>
              <button class="nav-btn text-primary">
                <Icon name="lucide:log-out" size="18" /> DÉCONNEXION
              </button>
            </nav>
          </aside>

          <!-- Main Content -->
          <div class="account-main">
            <!-- Commandes Section -->
            <div class="section-card glass">
              <div class="section-header">
                <h2>DERNIÈRES COMMANDES</h2>
                <NuxtLink to="/panier" class="btn btn--ghost btn--sm">NOUVELLE COMMANDE</NuxtLink>
              </div>

              <div class="orders-list">
                <div v-for="order in dummyOrders" :key="order.id" class="order-item">
                  <div class="order-id">
                    <span class="label">COMMANDE</span>
                    <span class="value">#{{ order.id }}</span>
                  </div>
                  <div class="order-date">
                    <span class="label">DATE</span>
                    <span class="value">{{ order.date }}</span>
                  </div>
                  <div class="order-total">
                    <span class="label">TOTAL</span>
                    <span class="value">{{ order.total }}€</span>
                  </div>
                  <div class="order-status">
                    <span class="status-badge" :class="order.status.toLowerCase()">{{ order.status }}</span>
                  </div>
                  <button class="btn btn--icon">
                    <Icon name="lucide:eye" size="18" class="text-white" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
const dummyOrders = [
  { id: 'JC-8521', date: '12 JAN 2025', total: 45, status: 'PAYÉ' },
  { id: 'JC-8410', date: '05 DEC 2024', total: 12, status: 'TERMINÉ' },
  { id: 'JC-8399', date: '18 OCT 2024', total: 24, status: 'ANNULÉ' }
];

useSeoMeta({
  title: 'Mon Compte - Japan Conventions',
  description: 'Gérez vos commandes et vos billets.'
});
</script>

<style lang="scss" scoped>
.account-page {
  background: $background-color;
  min-height: 100vh;
}

.hero-section {
  padding: 10rem 0 4rem;
  position: relative;
  
  .hero-mesh {
    position: absolute;
    inset: 0;
    background: radial-gradient(circle at 30% 70%, rgba($cyan-color, 0.1) 0%, transparent 60%);
    filter: blur(80px);
  }
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.75rem;
  font-weight: 800;
  margin-bottom: 2rem;
  opacity: 0.6;
  a { color: white; &:hover { color: $primary-color; } }
  .current { color: $primary-color; }
}

.hero-title {
  font-size: 4rem;
  font-weight: 900;
  color: white;
  span { color: transparent; -webkit-text-stroke: 1px rgba(255,255,255,0.3); }
}

.account-layout {
  display: grid;
  grid-template-columns: 320px 1fr;
  gap: 3rem;
  padding-bottom: 8rem;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr;
  }
}

.account-nav {
  padding: 2.5rem;
  border-radius: 30px;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);

  .user-profile {
    display: flex;
    align-items: center;
    gap: 1.25rem;
    margin-bottom: 3rem;

    .avatar {
      width: 50px;
      height: 50px;
      background: $primary-color;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 900;
      color: white;
      box-shadow: 0 0 20px rgba($primary-color, 0.4);
    }

    h3 { font-size: 1.1rem; color: white; margin-bottom: 0.2rem; }
    span { font-size: 0.8rem; color: rgba(255,255,255,0.4); font-weight: 700; }
  }

  .nav-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }

  .nav-btn {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem 1.5rem;
    background: none;
    border: none;
    color: rgba(255,255,255,0.5);
    font-size: 0.8rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 1px;
    cursor: pointer;
    border-radius: 12px;
    transition: all 0.3s;
    text-align: left;

    &:hover, &.active {
      background: rgba(255,255,255,0.05);
      color: white;
    }

    &.active {
      border-left: 3px solid $primary-color;
    }

    &.text-primary { color: $primary-color; }
  }

  .nav-divider {
    height: 1px;
    background: rgba(255,255,255,0.05);
    margin: 1.5rem 0;
  }
}

.section-card {
  padding: 3rem;
  background: rgba(255,255,255,0.02);
  border: 1px solid rgba(255,255,255,0.05);
  border-radius: 32px;

  .section-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 3rem;
    h2 { font-size: 1.2rem; color: white; font-weight: 900; letter-spacing: 2px; }
  }
}

.orders-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.order-item {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr 1fr auto;
  align-items: center;
  padding: 1.5rem 2rem;
  background: rgba(255,255,255,0.02);
  border-radius: 16px;
  transition: all 0.3s;

  &:hover { background: rgba(255,255,255,0.05); }

  .label {
    display: block;
    font-size: 0.6rem;
    font-weight: 900;
    color: rgba(255,255,255,0.2);
    letter-spacing: 2px;
    margin-bottom: 0.4rem;
  }

  .value {
    color: white;
    font-size: 0.9rem;
    font-weight: 700;
  }

  .status-badge {
    padding: 0.4rem 0.8rem;
    border-radius: 6px;
    font-size: 0.7rem;
    font-weight: 900;

    &.payé { background: rgba($success-color, 0.1); color: $success-color; }
    &.terminé { background: rgba(255,255,255,0.05); color: white; }
    &.annulé { background: rgba($error-color, 0.1); color: $error-color; }
  }
}
</style>
