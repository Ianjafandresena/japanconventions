# 📋 Cahier des Charges - Japan Conventions Frontend

> **Projet** : Refonte Headless CMS - japanconventions.com  
> **Version** : 1.2  
> **Date** : 01 Février 2026  
> **Dernière MAJ** : 02/02/2026 15:55  
> **Statut** : CPTs configurés et testés ✅

---

## 📌 Table des matières

1. [Contexte et Justification](#1-contexte-et-justification)
2. [Objectifs du Projet](#2-objectifs-du-projet)
3. [Architecture Technique](#3-architecture-technique)
4. [Ce qui a été réalisé](#4-ce-qui-a-été-réalisé)
5. [Ce qui reste à faire](#5-ce-qui-reste-à-faire)
6. [Planning prévisionnel](#6-planning-prévisionnel)

---

## 1. Contexte et Justification

### 1.1 Situation actuelle

Le site **japanconventions.com** est actuellement un site WordPress monolithique qui gère plusieurs festivals d'événements culturels japonais en France :

| Festival | Description |
|----------|-------------|
| **Japan Otaku Festival (JOF)** | Festival manga/anime |
| **Japan Manga Wave (JMW)** | Festival manga |
| **Gamer Connection** | Festival gaming |
| **Ink Secret** | Convention tattoo |
| **One Night Event** | Événements ponctuels |

### 1.2 Problèmes identifiés

| Problème | Impact | Gravité |
|----------|--------|---------|
| **Structure de données confuse** | Pages mélangées avec contenu admin | 🔴 Critique |
| **Pas de vraie base de données** | Événements stockés comme pages enfants | 🔴 Critique |
| **Données incohérentes** | 13 villes affichées au lieu de 10 pour JOF | 🟠 Majeur |
| **Pages orphelines** | Anciennes pages encore présentes (Nice, Metz, Lisieux) | 🟠 Majeur |
| **Performance** | Site WordPress lourd, pas de cache intelligent | 🟡 Moyen |
| **SEO** | Pas de SSR optimisé, meta tags manuels | 🟡 Moyen |
| **Maintenabilité** | Difficile de gérer les événements | 🟠 Majeur |

### 1.3 Justification du projet

La refonte vers une architecture **Headless CMS** (WordPress API + Nuxt.js Frontend) permet de :

1. **Séparer les responsabilités** : WordPress = données, Nuxt = présentation
2. **Améliorer les performances** : SSR + ISR + cache intelligent
3. **Structurer les données** : CPTs propres avec relations claires
4. **Faciliter la maintenance** : Interface admin intuitive pour les festivals
5. **Optimiser le SEO** : Meta tags dynamiques, sitemap auto, Core Web Vitals

---

## 2. Objectifs du Projet

### 2.1 Objectifs principaux

| # | Objectif | Priorité | Statut |
|---|----------|----------|--------|
| 1 | Créer un frontend Nuxt.js performant | 🔴 Haute | ✅ En cours |
| 2 | Structurer WordPress avec des CPTs propres | 🔴 Haute | ⏳ À faire |
| 3 | Connecter le frontend au backend via GraphQL | 🔴 Haute | ✅ Partiel |
| 4 | Implémenter le SSR pour le SEO | 🟠 Moyenne | ✅ Fait |
| 5 | Optimiser les performances (Lighthouse 90+) | 🟠 Moyenne | ⏳ À faire |
| 6 | Créer une interface admin claire | 🟡 Basse | ⏳ À faire |

### 2.2 Objectifs techniques (KPIs)

| Métrique | Cible | Actuel |
|----------|-------|--------|
| Lighthouse Performance | > 90 | ~70 |
| Lighthouse SEO | > 95 | ~80 |
| Time to First Byte | < 200ms | ~500ms |
| Largest Contentful Paint | < 2.5s | ~4s |
| Cumulative Layout Shift | < 0.1 | ~0.2 |

---

## 3. Architecture Technique

### 3.1 Stack technologique

```
┌─────────────────────────────────────────────────────────────────────┐
│                         UTILISATEUR                                 │
│                              │                                       │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                      FRONTEND (Nuxt 4)                        │  │
│  │  • SSR (Server-Side Rendering)                               │  │
│  │  • ISR (Incremental Static Regeneration)                     │  │
│  │  • Optimisation images (@nuxt/image)                         │  │
│  │  • Animations (@vueuse/motion)                               │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                              │                                       │
│                              │ GraphQL                               │
│                              ▼                                       │
│  ┌──────────────────────────────────────────────────────────────┐  │
│  │                     BACKEND (WordPress)                       │  │
│  │  • WPGraphQL (API GraphQL)                                   │  │
│  │  • CPT UI (création des CPTs)                                │  │
│  │  • ACF (champs personnalisés)                                │  │
│  │  • CPT Festival + CPT Événement + Taxonomie Ville            │  │
│  └──────────────────────────────────────────────────────────────┘  │
│                                                                      │
└─────────────────────────────────────────────────────────────────────┘
```

### 3.2 Structure des données

```
CPT Festival (1)  ──────┐
                        │ 1:N (relationship)
                        ▼
              CPT Événement (N)
                        │
                        │ N:1 (taxonomy)
                        ▼
              Taxonomie Ville
```

### 3.3 Flux de données

```
WordPress Admin          WPGraphQL              Nuxt Frontend
     │                       │                       │
     │  Crée événement      │                       │
     ├──────────────────────►                       │
     │                       │                       │
     │                       │   Query GraphQL      │
     │                       ◄──────────────────────┤
     │                       │                       │
     │                       │   JSON Response      │
     │                       ├──────────────────────►
     │                       │                       │
     │                       │                       │  SSR/ISR
     │                       │                       │  Cache
     │                       │                       │
```

---

## 4. Ce qui a été réalisé

### 4.1 Frontend Nuxt.js

| Composant | Fichier | Statut | Description |
|-----------|---------|--------|-------------|
| **Page Accueil** | `app/pages/index.vue` | ✅ Fait | Bento grid, animations |
| **Page Festival** | `app/pages/[slug].vue` | ✅ Fait | Détail festival + événements |
| **Page Presse** | `app/pages/presse.vue` | ✅ Fait | Articles de presse |
| **Header** | `app/components/TheHeader.vue` | ✅ Fait | Navigation responsive |
| **Footer** | `app/components/TheFooter.vue` | ✅ Fait | Liens, réseaux sociaux |
| **Hero Carousel** | `app/components/HeroCarousel.vue` | ✅ Fait | Carrousel animé |
| **Impact Jumbotron** | `app/components/ImpactJumbotron.vue` | ✅ Fait | Section impact |

### 4.2 Architecture modulaire

| Module | Dossier | Statut | Description |
|--------|---------|--------|-------------|
| **Festivals** | `app/modules/festivals/` | ✅ Fait | Service, composables, types |
| **Events** | `app/modules/events/` | ✅ Fait | EventCard, EventGrid |
| **Core** | `app/core/` | ✅ Fait | GraphQLClient |

### 4.3 Services et Composables

| Service | Fichier | Statut |
|---------|---------|--------|
| `FestivalService` | `modules/festivals/services/FestivalService.ts` | ✅ Fait |
| `EventService` | `modules/events/services/EventService.ts` | ✅ Fait |
| `GraphQLClient` | `core/services/GraphQLClient.ts` | ✅ Fait |
| `useFestivalsSSR` | `modules/festivals/composables/useFestivals.ts` | ✅ Fait |
| `usePressArticlesSSR` | `modules/festivals/composables/useFestivals.ts` | ✅ Fait |

### 4.4 Styles SCSS

| Fichier | Statut | Description |
|---------|--------|-------------|
| `assets/scss/_variables.scss` | ✅ Fait | Variables globales (couleurs, breakpoints) |
| `assets/scss/main.scss` | ✅ Fait | Styles globaux |
| `assets/scss/pages/_home.scss` | ✅ Fait | Styles page accueil |
| `assets/scss/pages/_festival.scss` | ✅ Fait | Styles page festival |
| `assets/scss/pages/_press.scss` | ✅ Fait | Styles page presse |

### 4.5 Configuration

| Fichier | Statut | Description |
|---------|--------|-------------|
| `nuxt.config.ts` | ✅ Fait | Config Nuxt, modules, GraphQL URL |
| `tsconfig.json` | ✅ Fait | Configuration TypeScript |
| `package.json` | ✅ Fait | Dépendances |

### 4.6 Documentation

| Document | Statut |
|----------|--------|
| `README.md` | ✅ Fait |
| `docs/GRAPHQL-SCHEMA.md` | ✅ Fait |
| `docs/WORDPRESS-ARCHITECTURE.md` | 🔄 En cours |

---

## 5. Ce qui reste à faire

### 5.1 Backend WordPress (Priorité HAUTE 🔴)

**Plugins déjà installés sur le serveur :**
- ✅ WPGraphQL
- ✅ CPT UI
- ✅ Smush (optimisation images)
- ✅ UpdraftPlus (sauvegardes)
- ✅ Forminator Pro

**À installer :**
- ⏳ ACF (gratuit)
- ⏳ WPGraphQL for ACF

| # | Tâche | Détail | Estimation |
|---|-------|--------|------------|
| 1 | **Créer CPT Festival** | Via CPT UI (déjà installé) | 10 min |
| 2 | **Créer CPT Événement** | Via CPT UI | 10 min |
| 3 | **Créer Taxonomie Ville** | Via CPT UI | 5 min |
| 4 | **Installer ACF** | Plugin gratuit depuis WordPress.org | 5 min |
| 5 | **Installer WPGraphQL for ACF** | Depuis GitHub | 5 min |
| 6 | **Configurer champs ACF** | Festival + Événement | 30 min |
| 7 | **Créer les festivals** | 5 festivals à créer | 20 min |
| 8 | **Créer les villes** | ~20 villes en taxonomie | 15 min |
| 9 | **Créer les événements** | ~30 événements | 1h30 |
| 10 | **Tester GraphQL** | Via GraphiQL | 15 min |

### 5.2 Frontend Nuxt (Priorité HAUTE 🔴)

| # | Tâche | Détail | Estimation |
|---|-------|--------|------------|
| 1 | **Mettre à jour FestivalService** | Nouvelles requêtes GraphQL pour CPTs | 1h |
| 2 | **Mettre à jour les types TypeScript** | Correspondre aux nouveaux CPTs | 30 min |
| 3 | **Adapter les composables** | useFestivalsSSR, useFestivalSSR | 1h |
| 4 | **Tester l'intégration** | Vérifier que tout fonctionne | 1h |

### 5.3 Optimisation Performance (Priorité MOYENNE 🟠)

| # | Tâche | Détail | Estimation |
|---|-------|--------|------------|
| 1 | **Implémenter ISR** | Cache avec revalidation | 2h |
| 2 | **Optimiser les images** | WebP, lazy loading, srcset | 1h |
| 3 | **Minifier CSS/JS** | Vite build optimizations | 30 min |
| 4 | **Analyser bundle** | Réduire la taille JavaScript | 1h |
| 5 | **Tester Lighthouse** | Viser 90+ sur toutes les métriques | 1h |

### 5.4 SEO (Priorité MOYENNE 🟠)

| # | Tâche | Détail | Estimation |
|---|-------|--------|------------|
| 1 | **Sitemap dynamique** | Plugin @nuxtjs/sitemap | 1h |
| 2 | **Robots.txt** | Configuration optimale | 15 min |
| 3 | **Schema.org JSON-LD** | Events, Organization | 1h |
| 4 | **Open Graph dynamique** | Images par événement | 1h |

### 5.5 Pages additionnelles (Priorité BASSE 🟡)

| # | Page | Détail | Estimation |
|---|------|--------|------------|
| 1 | `/billetterie` | Intégration billetterie | 4h |
| 2 | `/contact` | Formulaire de contact | 2h |
| 3 | `/mentions-legales` | Pages légales | 1h |
| 4 | `/exposants` | Espace exposants | 4h |

---

## 6. Planning prévisionnel

### Phase 1 : Backend WordPress (1-2 jours)

```
Jour 1 (3h)
├── Créer CPT Festival via CPT UI (10 min)
├── Créer CPT Événement via CPT UI (10 min)
├── Créer Taxonomie Ville via CPT UI (5 min)
├── Installer ACF + WPGraphQL for ACF (10 min)
├── Configurer les champs ACF (30 min)
├── Créer les 5 festivals (20 min)
├── Créer les villes (15 min)
└── Créer les événements JOF (45 min)

Jour 2 (2h)
├── Créer les événements restants (1h)
├── Tester les requêtes GraphQL (30 min)
└── Valider les données (30 min)
```

### Phase 2 : Intégration Frontend (Semaine 1-2)

```
Jour 4-5 (8h)
├── Mettre à jour FestivalService.ts
├── Mettre à jour les types
├── Adapter les composables
└── Tests d'intégration

Jour 6-7 (8h)
├── Debug et corrections
├── Optimisation performance
└── Tests Lighthouse
```

### Phase 3 : Finitions (Semaine 2)

```
Jour 8-10 (12h)
├── SEO (sitemap, schema.org)
├── Pages additionnelles
├── Tests cross-browser
└── Documentation finale
```

---

## 📎 Annexes

### A. Fichiers de référence

| Fichier | Description |
|---------|-------------|
| `docs/WORDPRESS-ARCHITECTURE.md` | Architecture technique détaillée |
| `docs/WORDPRESS-PLUGIN-INSTALL.md` | Guide d'installation du plugin |
| `docs/GRAPHQL-SCHEMA.md` | Schéma GraphQL documenté |

### B. Contacts

| Rôle | Responsable |
|------|-------------|
| Développement Frontend | [Votre nom] |
| Administration WordPress | [Admin WordPress] |
| Validation finale | [Client] |

---

## ✅ Validation

| Phase | Validé par | Date |
|-------|------------|------|
| Cahier des charges | [ ] | - |
| Architecture | [ ] | - |
| Développement | [ ] | - |
| Mise en production | [ ] | - |

---

> **Document créé le** : 01/02/2026  
> **Dernière mise à jour** : 01/02/2026 01:30  
> **Version** : 1.1
