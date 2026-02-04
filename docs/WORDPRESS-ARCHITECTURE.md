# 🏗️ Architecture WordPress - Japan Conventions

> **Version** : 2.0 (Optimisée sans ACF)  
> **Date** : 01 Février 2026

---

## 📋 Table des matières

1. [Vue d'ensemble](#1-vue-densemble)
2. [Structure des CPTs](#2-structure-des-cpts)
3. [Requêtes GraphQL](#3-requêtes-graphql)
4. [Optimisations Performance](#4-optimisations-performance)

---

## 1. Vue d'ensemble

### Architecture Headless

```
┌─────────────────────────────────────────────────────────────────────┐
│                        WORDPRESS BACKEND                            │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ┌──────────────────┐       ┌──────────────────┐                   │
│  │   CPT: Festival  │       │  Taxonomie: Ville │                  │
│  ├──────────────────┤       ├──────────────────┤                   │
│  │ • Japan Otaku    │       │ • Marseille      │                   │
│  │ • Japan Manga    │       │ • Albi           │                   │
│  │ • Gamer Connect  │       │ • Troyes         │                   │
│  │ • Ink Secret     │       │ • Chambéry       │                   │
│  │ • One Night      │       │ • etc.           │                   │
│  └────────┬─────────┘       └────────┬─────────┘                   │
│           │                          │                              │
│           │ (1:N)                    │ (N:1)                        │
│           ▼                          ▼                              │
│  ┌────────────────────────────────────────────────────────────┐    │
│  │                      CPT: Événement                         │    │
│  ├────────────────────────────────────────────────────────────┤    │
│  │  • JOF Albi 2025       (Festival: JOF, Ville: Albi)        │    │
│  │  • JOF Marseille 2025  (Festival: JOF, Ville: Marseille)   │    │
│  │  • JMW Paris 2025      (Festival: JMW, Ville: Paris)       │    │
│  │  • GC Aubagne 2025     (Festival: Gamer, Ville: Aubagne)   │    │
│  └────────────────────────────────────────────────────────────┘    │
│                                                                     │
│  Plugin: japan-conventions-cpts.php                                │
│  Plugin: WPGraphQL (requis)                                        │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
                               │
                               │ GraphQL API
                               ▼
┌─────────────────────────────────────────────────────────────────────┐
│                        NUXT.JS FRONTEND                             │
├─────────────────────────────────────────────────────────────────────┤
│  • SSR (Server-Side Rendering)                                     │
│  • ISR (Incremental Static Regeneration)                           │
│  • Logos stockés localement (/public/logos/)                       │
│  • Cache intelligent                                                │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 2. Structure des CPTs

### 2.1 CPT: `festival`

| Champ | Type WordPress | GraphQL | Description |
|-------|----------------|---------|-------------|
| `ID` | auto | `databaseId` | ID unique |
| `title` | post_title | `title` | Nom du festival |
| `slug` | post_name | `slug` | URL slug |
| `logo_id` | meta | `festivalMeta.logoId` | ID local ("jof", "jmw", "gc") |
| `color` | meta | `festivalMeta.color` | Couleur hex "#e60012" |
| `description` | post_content | `content` | Description courte |
| `status` | meta | `festivalMeta.status` | "active" / "inactive" |

**Mapping des logos (côté frontend)** :
```typescript
// Frontend : app/utils/logoMapping.ts
const LOGO_MAP: Record<string, string> = {
  'jof': '/logos/japan-otaku-festival.webp',
  'jmw': '/logos/japan-manga-wave.webp',
  'gc': '/logos/gamer-connection.webp',
  'ink': '/logos/ink-secret.webp',
  'one': '/logos/one-night-event.webp',
};
```

### 2.2 CPT: `evenement`

| Champ | Type WordPress | GraphQL | Description |
|-------|----------------|---------|-------------|
| `ID` | auto | `databaseId` | ID unique |
| `title` | post_title | `title` | Ex: "JOF Albi 2025" |
| `slug` | post_name | `slug` | URL slug |
| `festival_id` | meta | `evenementMeta.festivalId` | ID du festival parent |
| `lieu_nom` | meta | `evenementMeta.lieuNom` | "Parc Expo" |
| `date_debut` | meta | `evenementMeta.dateDebut` | "2025-01-31" |
| `date_fin` | meta | `evenementMeta.dateFin` | "2025-02-01" |
| `billetterie_url` | meta | `evenementMeta.billetterieUrl` | URL |
| `statut` | meta | `evenementMeta.statut` | "a_venir" / "termine" |
| `ville` | taxonomy | `villes.nodes` | Taxonomie ville |

### 2.3 Taxonomie: `ville`

| Champ | Type | Description |
|-------|------|-------------|
| `name` | term_name | Nom de la ville |
| `slug` | term_slug | URL slug |

---

## 3. Requêtes GraphQL

### 3.1 Récupérer tous les festivals

```graphql
query GetAllFestivals {
  festivals(first: 10, where: { orderby: { field: TITLE, order: ASC } }) {
    nodes {
      databaseId
      title
      slug
      content
      festivalMeta {
        logoId
        color
        status
      }
    }
  }
}
```

### 3.2 Récupérer un festival avec ses événements

```graphql
query GetFestivalWithEvents($slug: ID!) {
  festival(id: $slug, idType: SLUG) {
    databaseId
    title
    slug
    content
    festivalMeta {
      logoId
      color
      status
    }
  }
  evenements(
    first: 50
    where: {
      metaQuery: {
        relation: AND
        metaArray: [
          { key: "festival_id", value: $festivalId, compare: EQUAL_TO }
        ]
      }
      orderby: { field: META_KEY, metaKey: "date_debut", order: ASC }
    }
  ) {
    nodes {
      databaseId
      title
      slug
      evenementMeta {
        lieuNom
        dateDebut
        dateFin
        billetterieUrl
        statut
      }
      villes {
        nodes {
          name
          slug
        }
      }
    }
  }
}
```

### 3.3 Récupérer les événements à venir

```graphql
query GetUpcomingEvents($today: String!) {
  evenements(
    first: 20
    where: {
      metaQuery: {
        key: "date_debut"
        value: $today
        compare: GREATER_THAN_OR_EQUAL_TO
        type: DATE
      }
      orderby: { field: META_KEY, metaKey: "date_debut", order: ASC }
    }
  ) {
    nodes {
      databaseId
      title
      slug
      evenementMeta {
        festivalId
        lieuNom
        dateDebut
        dateFin
        statut
      }
      villes {
        nodes {
          name
        }
      }
    }
  }
}
```

### 3.4 Récupérer les villes

```graphql
query GetAllVilles {
  villes(first: 100) {
    nodes {
      databaseId
      name
      slug
      count
    }
  }
}
```

---

## 4. Optimisations Performance

### 4.1 Logos stockés localement

❌ **Mauvais** (surcharge réseau) :
```graphql
# Charge une image externe à chaque requête
logo { sourceUrl }
```

✅ **Bon** (optimisé) :
```graphql
# Juste un ID texte
festivalMeta { logoId }
```

```typescript
// Frontend résout localement
const logoUrl = LOGO_MAP[festival.festivalMeta.logoId];
// → '/logos/japan-otaku-festival.webp' (déjà en cache)
```

### 4.2 ISR (Incremental Static Regeneration)

```typescript
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { isr: 3600 },           // Home : cache 1h
    '/festivals/**': { isr: 3600 }, // Festivals : cache 1h
    '/presse': { isr: 86400 },    // Presse : cache 24h
  }
});
```

### 4.3 Images optimisées

```vue
<NuxtImg
  :src="logoUrl"
  format="webp"
  quality="85"
  loading="lazy"
  width="200"
  height="200"
/>
```

### 4.4 Cache des requêtes GraphQL

```typescript
// Utiliser useAsyncData avec clé unique
const { data } = await useAsyncData(
  `festival-${slug}`,  // Clé de cache unique
  () => fetchFestival(slug),
  { 
    transform: (data) => transformFestival(data),
    getCachedData: (key, nuxtApp) => nuxtApp.payload.data[key]
  }
);
```

---

## 📎 Fichiers associés

| Fichier | Description |
|---------|-------------|
| `docs/WORDPRESS-PLUGIN-INSTALL.md` | Guide d'installation |
| `docs/CAHIER-DES-CHARGES.md` | Cahier des charges complet |
| `public/logos/` | Logos des festivals (à créer) |

---

> **Dernière mise à jour** : 01/02/2026
