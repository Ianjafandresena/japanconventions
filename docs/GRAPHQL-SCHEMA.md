# 📊 Schéma GraphQL Optimisé - Japan Conventions

> Analyse du 31/01/2026 - Endpoint: `https://japanconventions.com/graphql`

---

## ✅ Données Disponibles et Utiles

### 1. **Pages** (Festivals & Villes)
Structure hiérarchique utilisée pour les festivals et leurs événements par ville.

| Festival | URI | Villes |
|----------|-----|--------|
| Japan Otaku Festival | `/japan-otaku-festival/` | 16 villes (Marseille, Troyes, Chambéry, etc.) |
| Japan Manga Wave | `/japan-manga-wave/` | 5 villes (Douai, Rennes, Strasbourg, etc.) |
| Gamer Connection | `/gamer-connection/` | 2 villes (Aubagne, Castres) |
| Ink Secret | `/ink-secret/` | 0 (à venir) |
| One Night Event | `/evenement-a-venir/` | 0 (à venir) |

**Requête optimisée:**
```graphql
query GetFestival($uri: ID!) {
  page(id: $uri, idType: URI) {
    id
    title
    children(first: 50) {
      nodes {
        ... on Page { id title slug uri }
      }
    }
  }
}
```

---

### 2. **Posts** (Articles de Presse)
Articles du blog avec catégorisation.

**Requête optimisée:**
```graphql
query GetPosts($first: Int!) {
  posts(first: $first, where: {orderby: {field: DATE, order: DESC}}) {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage {
        node { sourceUrl altText }
      }
      categories {
        nodes { name slug }
      }
    }
  }
}
```

---

### 3. **Menus** (Navigation)
Menu principal avec 3 entrées.

**Requête optimisée:**
```graphql
query GetMenu {
  menus {
    nodes {
      name
      menuItems {
        nodes {
          id
          label
          url
          path
          parentId
        }
      }
    }
  }
}
```

---

### 4. **MediaItems** (Images)
Images avec tailles optimisées disponibles.

**Tailles disponibles:**
- `thumbnail` (150x150)
- `medium` (300x300)
- `medium_large` (768xN)
- `large` (1024x1024)
- `1536x1536`
- `2048x2048`
- `woocommerce_thumbnail`
- `post-thumbnail`

---

### 5. **Events** (CPT - Custom Post Type)
⚠️ Un seul event test trouvé - CPT peut-être non utilisé en production.

```graphql
query GetEvents {
  events(first: 10) {
    nodes {
      id
      title
      slug
      date
      excerpt
      featuredImage { node { sourceUrl } }
    }
  }
}
```

---

## ❌ Données Non Disponibles

| Donnée | Raison | Alternative |
|--------|--------|-------------|
| **WooCommerce (products)** | Plugin WPGraphQL-WooCommerce non activé | Redirection vers WordPress |
| **ACF Fields** | Non exposés dans GraphQL public | Utiliser les données des pages |
| **Introspection** | Désactivée pour requêtes publiques | N/A |
| **Cart/Checkout** | WooCommerce headless non configuré | Liens directs vers WordPress |

---

## 🎯 Stratégie d'Optimisation Performance

### Architecture Headless Recommandée

```
┌─────────────────────────────────────────────────────────────────┐
│                        NUXT FRONTEND                            │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  SSG/ISR (Build-time + Revalidation)                           │
│  ├── / (accueil)          → Festivals ISR 1h                   │
│  ├── /[festival]          → Villes ISR 1h                      │
│  └── /presse              → Articles ISR 15min                 │
│                                                                 │
│  CSR (Client-side, liens externes)                             │
│  ├── /[festival]/[ville]/visiteur → japanconventions.com       │
│  ├── /[festival]/[ville]/exposant → japanconventions.com       │
│  └── /panier, /checkout          → japanconventions.com        │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────────┐
│                    WORDPRESS BACKEND                            │
├─────────────────────────────────────────────────────────────────┤
│  • WPGraphQL (lecture seule)                                    │
│  • WooCommerce (billetterie, panier, checkout)                 │
│  • Pages admin (dossier exposant, bénévole)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Requêtes Optimisées (Minimales)

**Page d'accueil:**
```graphql
# Une seule requête pour tous les festivals
query GetAllFestivals {
  japanOtaku: page(id: "/japan-otaku-festival/", idType: URI) {
    ...FestivalFields
  }
  japanManga: page(id: "/japan-manga-wave/", idType: URI) {
    ...FestivalFields
  }
  gamer: page(id: "/gamer-connection/", idType: URI) {
    ...FestivalFields
  }
}

fragment FestivalFields on Page {
  id
  title
  children(first: 50) {
    nodes { ... on Page { id title slug uri } }
  }
}
```

### Stratégie de Cache

| Donnée | TTL Cache | Raison |
|--------|-----------|--------|
| Menus | 24h | Rarement modifié |
| Festivals (structure) | 1h | Structure stable |
| Villes/Events | 1h | Nouvelles dates rares |
| Articles Presse | 15min | Nouveaux articles possibles |
| Images | CDN permanent | Immutable |

---

## 📈 Gains de Performance Attendus

| Métrique | WordPress Actuel | Headless Nuxt |
|----------|-----------------|---------------|
| **Time to First Byte** | ~800ms | ~50ms |
| **First Contentful Paint** | ~2.5s | ~0.8s |
| **Largest Contentful Paint** | ~4s | ~1.5s |
| **Core Web Vitals** | ❌ Fail | ✅ Pass |
| **SEO Score** | ~70 | ~95+ |

---

## 🔧 Configuration Nuxt Recommandée

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  // SSR avec ISR
  routeRules: {
    '/': { isr: 3600 },           // Accueil: 1h
    '/presse': { isr: 900 },      // Presse: 15min
    '/**': { isr: 3600 }          // Autres: 1h
  },
  
  // Cache des requêtes GraphQL
  nitro: {
    routeRules: {
      '/api/**': { 
        cache: { 
          maxAge: 3600,
          staleMaxAge: 86400 
        } 
      }
    }
  }
})
```

---

## ✅ Checklist Implémentation

- [x] Client GraphQL fonctionnel
- [x] Service Festivals (pages + enfants)
- [x] Service Articles (posts)
- [ ] Service Menus dynamique
- [ ] ISR/Cache configuration
- [ ] Images optimisées (WebP/AVIF)
- [ ] Sitemap dynamique
- [ ] Liens billetterie externes
