<template>
  <div class="checkout-page">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-mesh"></div>
      <div class="hero-noise"></div>
      <div class="container hero-container">
        <nav class="breadcrumb" v-motion-fade>
          <NuxtLink to="/">ACCUEIL</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" class="separator" />
          <NuxtLink to="/panier">PANIER</NuxtLink>
          <Icon name="lucide:chevron-right" size="14" class="separator" />
          <span class="current">FINALISATION</span>
        </nav>

        <div class="hero-content" v-motion-slide-top>
          <div class="hero-badge" v-motion-pop :delay="400">PAIEMENT SÉCURISÉ</div>
          <h1 class="hero-title">
            FINALISER <br/>
            <span>MA COMMANDE</span>
          </h1>
        </div>
      </div>
    </section>

    <!-- Checkout Content -->
    <section class="checkout-section">
      <div class="container">
        <form @submit.prevent="handleSubmit" class="checkout-grid">
          <!-- Left Column: Forms -->
          <div class="forms-column">
            <!-- 1. Documents Section -->
            <div class="checkout-card glass" v-motion-slide-visible-bottom>
              <div class="card-header">
                <Icon name="lucide:file-text" size="24" class="text-primary" />
                <h2>DOCUMENTS REQUIS POUR VOTRE INSCRIPTION</h2>
              </div>
              <p class="card-desc">Merci de fournir les documents suivants pour finaliser votre commande :</p>

              <div class="upload-group required">
                <label>Justificatif de paiement (OBLIGATOIRE)</label>
                <p class="label-sub">Capture d'écran ou photo de votre preuve de paiement</p>
                <div class="file-dropzone glass">
                  <Icon name="lucide:image" size="32" />
                  <div class="dropzone-text">
                    <span class="main-text">Justificatif de paiement (max 5MB)</span>
                    <span class="sub-text">Formats acceptés : JPG, PNG</span>
                  </div>
                  <input type="file" @change="handleFileChange($event, 'payment')" accept=".jpg,.jpeg,.png" required />
                </div>
              </div>

              <div class="upload-group mt-8">
                <label>Produits que vous allez vendre</label>
                <p class="label-sub">Téléchargez des images/catalogues des produits que vous exposerez (optionnel, multiple fichiers autorisés)</p>
                <div class="file-dropzone glass">
                  <Icon name="lucide:package" size="32" />
                  <div class="dropzone-text">
                    <span class="main-text">Fichiers produits</span>
                    <span class="sub-text">Formats : JPG, PNG, PDF, DOC, XLS (max 10MB)</span>
                  </div>
                  <input type="file" @change="handleFileChange($event, 'products')" accept=".jpg,.jpeg,.png,.pdf,.doc,.docx,.xls,.xlsx" multiple />
                </div>
              </div>
              
              <div class="info-box glass mt-8">
                <Icon name="lucide:info" size="20" />
                <p>Uploader la preuve en image de votre virement bancaire; pour les exposants, il faut aussi uploader les photos de vos produits ici pour qu'on puisse valider votre commande. Le virement doit être effectuer avant d'uploader la preuve ici.</p>
              </div>
              
              <button type="button" class="coupon-link" @click="showCoupon = !showCoupon">
                Vous avez un coupon ? Cliquez ici pour entrer votre code
              </button>
              <div v-if="showCoupon" class="coupon-input glass mt-4">
                <input type="text" placeholder="CODE COUPON" v-model="form.coupon" />
                <button type="button" class="btn btn--sm btn--primary">APPLIQUER</button>
              </div>
            </div>

            <!-- 2. Billing Section -->
            <div class="checkout-card glass mt-8" v-motion-slide-visible-bottom>
              <div class="card-header">
                <Icon name="lucide:map-pin" size="24" class="text-primary" />
                <h2>COORDONNÉES DE FACTURATION</h2>
              </div>
              
              <div class="form-grid">
                <div class="input-group">
                  <label>Prénom *</label>
                  <input type="text" v-model="form.firstName" required class="glass" />
                </div>
                <div class="input-group">
                  <label>Nom *</label>
                  <input type="text" v-model="form.lastName" required class="glass" />
                </div>
                <div class="input-group full">
                  <label>Numéro et nom de rue *</label>
                  <input type="text" v-model="form.address" required class="glass" />
                </div>
                <div class="input-group full">
                  <label>Appartement, suite, unité, etc.</label>
                  <input type="text" v-model="form.address2" class="glass" />
                </div>
                <div class="input-group">
                  <label>Ville *</label>
                  <input type="text" v-model="form.city" required class="glass" />
                </div>
                <div class="input-group">
                  <label>Code postal *</label>
                  <input type="text" v-model="form.zip" required class="glass" />
                </div>
                <div class="input-group">
                  <label>Téléphone *</label>
                  <input type="tel" v-model="form.phone" required class="glass" />
                </div>
                <div class="input-group">
                  <label>Email *</label>
                  <input type="email" v-model="form.email" required class="glass" />
                </div>
              </div>
            </div>

            <!-- 3. Demande Section -->
            <div class="checkout-card glass mt-8" v-motion-slide-visible-bottom>
              <div class="card-header">
                <Icon name="lucide:message-square" size="24" class="text-primary" />
                <h2>DEMANDE</h2>
              </div>
              <div class="input-group full">
                <label>Vos besoins à prendre en considération / Descriptif de vos produits</label>
                <p class="label-sub">Seuls les produits décrits peuvent être présentés sur le stand.</p>
                <textarea v-model="form.notes" rows="4" class="glass"></textarea>
              </div>
            </div>
          </div>

          <!-- Right Column: Summary & Payment -->
          <div class="summary-column">
            <div class="sticky-column">
              <!-- Order Summary -->
              <div class="summary-card glass" v-motion-slide-visible-right>
                <h2>VOTRE COMMANDE</h2>
                
                <div class="order-table">
                  <div class="table-header">
                    <span>PRODUIT</span>
                    <span>SOUS-TOTAL (TTC)</span>
                  </div>
                  
                  <div v-for="item in cart" :key="item.id" class="table-row">
                    <span class="product-name">{{ item.festivalName }} - {{ item.city }} <span class="qty">× {{ item.quantity }}</span></span>
                    <span class="product-total">{{ (item.price * item.quantity).toFixed(2) }} €</span>
                  </div>

                  <div class="summary-divider"></div>
                  
                  <div class="table-footer">
                    <div class="footer-line">
                      <span>SOUS-TOTAL (TTC)</span>
                      <span>{{ cartTotal.toFixed(2) }} €</span>
                    </div>
                    <div class="footer-line">
                      <span>FRAIS DE TRANSACTION</span>
                      <span>{{ fees.toFixed(2) }} €</span>
                    </div>
                    <div class="total-line">
                      <span>TOTAL TTC TOUT COMPRIS</span>
                      <span class="total-amount">{{ (cartTotal + fees).toFixed(2) }} €</span>
                    </div>
                  </div>
                </div>

                <!-- Bank Info -->
                <div class="bank-section glass mt-8">
                  <div class="bank-header">
                    <div class="radio-indicator active"></div>
                    <h3>VIREMENT BANCAIRE</h3>
                  </div>
                  <p class="bank-instruct">
                    Effectuez le paiement directement depuis votre compte bancaire. Veuillez utiliser <strong>l'ID de votre commande</strong> comme référence du paiement. Votre commande ne sera pas validée tant que les fonds ne seront pas reçus.
                  </p>
                  
                  <div class="bank-details glass">
                    <div class="detail">
                      <span class="label">NOM DU COMPTE</span>
                      <span class="value">SHURIKEN EVENTS SRL</span>
                    </div>
                    <div class="detail">
                      <span class="label">NUMÉRO DE COMPTE</span>
                      <span class="value">BE10 7320 8269 7504</span>
                    </div>
                    <div class="detail">
                      <span class="label">NOM DE LA BANQUE</span>
                      <span class="value">CBC WATERLOO</span>
                    </div>
                  </div>
                </div>

                <div class="privacy-note">
                  Your personal data will be used to process your order, support your experience throughout this website, and for other purposes described in our <NuxtLink to="/politique-de-confidentialite">politique de confidentialité</NuxtLink>.
                </div>

                <div class="terms-accept">
                  <label class="checkbox-container">
                    <input type="checkbox" v-model="form.acceptTerms" required />
                    <span class="checkmark"></span>
                    J’ai lu et j’accepte les conditions générales *
                  </label>
                </div>

                <button type="submit" class="btn btn--primary btn--lg w-full mt-6" :disabled="!form.acceptTerms">
                  ENREGISTRER LES DOCUMENTS & PAYER
                </button>
              </div>
            </div>
          </div>
        </form>
      </div>
    </section>

    <!-- Impact Jumbotron -->
    <ImpactJumbotron />
  </div>
</template>

<script setup lang="ts">
import { useCart } from '~/modules/cart';
import { ref, reactive, computed } from 'vue';

const { cart, cartTotal } = useCart();
const showCoupon = ref(false);

const fees = computed(() => cartTotal.value * 0.055); // Sample transaction fees based on user input (around 5.5%)

const form = reactive({
  firstName: '',
  lastName: '',
  address: '',
  address2: '',
  city: '',
  zip: '',
  phone: '',
  email: 'ianjafandresena1@gmail.com',
  notes: '',
  coupon: '',
  acceptTerms: false,
});

const handleFileChange = (event: Event, type: string) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    console.log(`Uploaded ${type} files:`, target.files);
  }
};

const handleSubmit = () => {
  if (!form.acceptTerms) return;
  alert('COMMANDE ENREGISTRÉE ! RÉFÉRENCE: JC-ORDER-TEMP. VEUILLEZ PROCÉDER AU VIREMENT.');
};

useSeoMeta({
  title: 'Paiement - Japan Conventions',
  description: 'Finalisez votre inscription et accédez au Hub Otaku.'
});
</script>

<style lang="scss" scoped>
.checkout-page {
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
  background: radial-gradient(circle at 50% 50%, rgba($primary-color, 0.1) 0%, transparent 60%);
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
  position: relative;
  z-index: 1;

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
  font-size: clamp(3rem, 10vw, 4.5rem);
  line-height: 0.85;
  color: white;
  font-weight: 900;
  text-transform: uppercase;

  span {
    color: transparent;
    -webkit-text-stroke: 1px rgba(255,255,255,0.2);
  }
}

// Global Checkout Layout
.checkout-section {
  padding-bottom: 10rem;
}

.checkout-grid {
  display: grid;
  grid-template-columns: 1fr 450px;
  gap: 4rem;

  @media (max-width: $desktop) {
    grid-template-columns: 1fr;
  }
}

.sticky-column {
  position: sticky;
  top: 100px;
}

// Card Styling
.checkout-card {
  padding: 3rem;
  border-radius: 32px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);

  .card-header {
    display: flex;
    align-items: center;
    gap: 1.5rem;
    margin-bottom: 2rem;
    
    h2 { font-size: 1rem; color: white; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; }
    .text-primary { color: $primary-color; }
  }

  .card-desc {
    color: rgba(255, 255, 255, 0.4);
    font-size: 0.95rem;
    margin-bottom: 3rem;
  }
}

// Upload Area
.upload-group {
  label { display: block; color: white; font-weight: 800; font-size: 1.1rem; margin-bottom: 0.5rem; }
  .label-sub { font-size: 0.85rem; color: rgba(255, 255, 255, 0.3); margin-bottom: 1.5rem; }

  &.required label::after { content: ' *'; color: $primary-color; }
}

.file-dropzone {
  position: relative;
  padding: 3rem 2rem;
  border: 2px dashed rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 1.5rem;
  transition: all 0.3s;
  cursor: pointer;

  &:hover {
    border-color: $primary-color;
    background: rgba($primary-color, 0.02);
    .lucide { color: $primary-color; transform: scale(1.1); }
  }

  .lucide { color: rgba(255, 255, 255, 0.2); transition: all 0.3s; }

  .dropzone-text {
    .main-text { display: block; color: white; font-weight: 700; margin-bottom: 0.5rem; }
    .sub-text { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); font-weight: 600; letter-spacing: 1px; }
  }

  input[type="file"] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
  }
}

.info-box {
  display: flex;
  gap: 1.5rem;
  padding: 1.5rem;
  background: rgba($japan-gold, 0.05);
  border: 1px solid rgba($japan-gold, 0.1);
  border-radius: 16px;
  color: rgba($japan-gold, 0.8);
  font-size: 0.85rem;
  font-weight: 600;
  line-height: 1.6;
  .lucide { flex-shrink: 0; }
}

.coupon-link {
  background: none;
  border: none;
  color: $primary-color;
  font-weight: 800;
  font-size: 0.85rem;
  cursor: pointer;
  margin-top: 2rem;
  display: block;
}

.coupon-input {
  display: flex;
  padding: 0.5rem;
  border-radius: 12px;
  gap: 0.5rem;
  input { flex: 1; background: none; border: none; color: white; padding: 0.5rem 1rem; font-weight: 800; font-size: 0.8rem; letter-spacing: 2px; }
}

// Form Styling
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;

  @media (max-width: $tablet) {
    grid-template-columns: 1fr;
  }
}

.input-group {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;

  &.full { grid-column: span 2; @media (max-width: $tablet) { grid-column: span 1; } }

  label { font-size: 0.75rem; font-weight: 900; color: rgba(255, 255, 255, 0.3); letter-spacing: 2px; text-transform: uppercase; }
  
  input, textarea {
    padding: 1.25rem 1.5rem;
    border-radius: 14px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    color: white;
    font-size: 1rem;
    font-weight: 600;
    transition: all 0.3s;

    &:focus { outline: none; border-color: $primary-color; background: rgba(255, 255, 255, 0.05); }
  }
}

// Summary Sidebar
.summary-card {
  padding: 3rem;
  border-radius: 40px;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);

  h2 { font-size: 1.2rem; color: white; font-weight: 900; letter-spacing: 3px; margin-bottom: 3rem; border-left: 4px solid $primary-color; padding-left: 1.5rem; }
}

.order-table {
  .table-header {
    display: flex;
    justify-content: space-between;
    font-size: 0.7rem;
    font-weight: 900;
    color: rgba(255, 255, 255, 0.2);
    letter-spacing: 2px;
    margin-bottom: 1.5rem;
    padding-bottom: 1rem;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  }

  .table-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1.5rem;
    font-size: 0.9rem;
    font-weight: 700;
    color: white;

    .product-name {
      max-width: 250px;
      line-height: 1.4;
      .qty { color: $primary-color; margin-left: 0.5rem; }
    }
  }

  .summary-divider { height: 1px; background: rgba(255, 255, 255, 0.05); margin: 2rem 0; }

  .table-footer {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;

    .footer-line {
      display: flex;
      justify-content: space-between;
      font-size: 0.8rem;
      font-weight: 800;
      color: rgba(255, 255, 255, 0.4);
      letter-spacing: 1px;
    }

    .total-line {
      display: flex;
      flex-direction: column;
      margin-top: 1rem;
      gap: 1rem;
      span:first-child { font-size: 0.75rem; color: rgba(255, 255, 255, 0.3); font-weight: 900; letter-spacing: 2px; }
      .total-amount { font-size: 2.5rem; color: white; font-weight: 900; text-shadow: 0 0 20px rgba($primary-color, 0.3); }
    }
  }
}

// Bank Info
.bank-section {
  padding: 2rem;
  border-radius: 20px;
  background: rgba(0, 0, 0, 0.2);

  .bank-header {
    display: flex;
    align-items: center;
    gap: 1rem;
    margin-bottom: 1.5rem;
    h3 { font-size: 0.9rem; color: white; font-weight: 900; letter-spacing: 1px; }
    .radio-indicator {
      width: 16px;
      height: 16px;
      border-radius: 50%;
      border: 2px solid $primary-color;
      position: relative;
      &.active::after {
        content: '';
        position: absolute;
        inset: 3px;
        background: $primary-color;
        border-radius: 50%;
      }
    }
  }

  .bank-instruct {
    font-size: 0.8rem;
    color: rgba(255, 255, 255, 0.5);
    line-height: 1.6;
    margin-bottom: 2rem;
    strong { color: white; }
  }
}

.bank-details {
  padding: 1.5rem;
  .detail {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
    margin-bottom: 1.25rem;
    &:last-child { margin-bottom: 0; }

    .label { font-size: 0.6rem; font-weight: 900; color: rgba(255, 255, 255, 0.2); letter-spacing: 2px; }
    .value { font-size: 0.85rem; color: $japan-gold; font-weight: 800; letter-spacing: 1px; }
  }
}

.privacy-note {
  margin-top: 3rem;
  font-size: 0.75rem;
  color: rgba(255, 255, 255, 0.35);
  line-height: 1.6;
  a { color: white; border-bottom: 1px solid rgba(255, 255, 255, 0.1); transition: all 0.3s; &:hover { color: $primary-color; border-color: $primary-color; } }
}

.terms-accept {
  margin-top: 2rem;
}

// Custom Checkbox
.checkbox-container {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  cursor: pointer;
  font-size: 0.8rem;
  font-weight: 800;
  color: white;
  user-select: none;

  input { position: absolute; opacity: 0; cursor: pointer; height: 0; width: 0; }

  .checkmark {
    height: 20px;
    width: 20px;
    background: rgba(255, 255, 255, 0.05);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 6px;
    flex-shrink: 0;
    position: relative;
    transition: all 0.3s;
  }

  &:hover input ~ .checkmark { background: rgba(255, 255, 255, 0.1); }
  input:checked ~ .checkmark { background: $primary-color; border-color: $primary-color; }

  .checkmark:after {
    content: "";
    position: absolute;
    display: none;
    left: 6px;
    top: 2px;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 2px 2px 0;
    transform: rotate(45deg);
  }

  input:checked ~ .checkmark:after { display: block; }
}

.mt-8 { margin-top: 2rem; }
.mt-6 { margin-top: 1.5rem; }
.mt-4 { margin-top: 1rem; }
.w-full { width: 100%; justify-content: center; }
</style>
