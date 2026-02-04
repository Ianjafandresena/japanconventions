# 🎌 Japan Conventions - Frontend Headless

Frontend Nuxt 4 connecté au site WordPress [japanconventions.com](https://japanconventions.com) via WPGraphQL.

## 📋 Prérequis

- **Node.js** : version 18.x ou supérieure (recommandé : 20.x)
- **npm** : version 9.x ou supérieure (inclus avec Node.js)
- **Git** : pour cloner le projet

### Vérifier les versions installées

```bash
node --version   # Doit afficher v18.x.x ou plus
npm --version    # Doit afficher 9.x.x ou plus
```

### Installer Node.js (si nécessaire)

Télécharger depuis : https://nodejs.org/fr (choisir la version LTS)

---

## 🚀 Installation & Lancement

### 1. Cloner le projet

```bash
git clone <url-du-repo>
cd japanconventions-frontend
```

### 2. Installer les dépendances

```bash
npm install
```

> ⏳ Cette étape peut prendre 1-2 minutes la première fois.

### 3. Lancer le serveur de développement

```bash
npm run dev
```

### 4. Ouvrir dans le navigateur

👉 **http://localhost:3000**

---

## 📁 Structure du Projet

```
japanconventions-frontend/
├── app/
│   ├── components/          # Composants UI (Header, Footer, etc.)
│   ├── core/                # Services de base (GraphQL Client)
│   ├── layouts/             # Layouts Nuxt
│   ├── modules/             # Modules métier
│   │   ├── events/          # Gestion des événements
│   │   └── festivals/       # Gestion des festivals
│   ├── pages/               # Pages de l'application
│   │   ├── index.vue        # Page d'accueil
│   │   ├── [slug].vue       # Pages festivals dynamiques
│   │   └── presse.vue       # Page presse
│   └── assets/              # Styles SCSS
├── public/                  # Fichiers statiques
├── nuxt.config.ts           # Configuration Nuxt
└── package.json             # Dépendances npm
```

---

## 🔧 Scripts Disponibles

| Commande | Description |
|----------|-------------|
| `npm run dev` | Lance le serveur de développement (http://localhost:3000) |
| `npm run build` | Compile l'application pour la production |
| `npm run generate` | Génère le site statique (SSG) |
| `npm run preview` | Prévisualise le build de production |

---

## ⚙️ Configuration

### Variables d'environnement

Le projet utilise les variables suivantes (configurées dans `nuxt.config.ts`) :

| Variable | Valeur par défaut |
|----------|-------------------|
| `wordpressUrl` | `https://japanconventions.com/graphql` |
| `siteUrl` | `https://japanconventions.com` |

Pour personnaliser (optionnel), créer un fichier `.env` :

```env
NUXT_PUBLIC_WORDPRESS_URL=https://japanconventions.com/graphql
NUXT_PUBLIC_SITE_URL=https://japanconventions.com
```

---

## 🌐 API WordPress

Le frontend se connecte à l'API GraphQL de WordPress :

- **Endpoint** : `https://japanconventions.com/graphql`
- **Plugin requis** : WPGraphQL (déjà installé sur le site)

### Tester l'API manuellement

```bash
curl -X POST https://japanconventions.com/graphql \
  -H "Content-Type: application/json" \
  -d '{"query": "{ generalSettings { title } }"}'
```

---

## 🐛 Résolution de Problèmes

### Erreur "Module not found"
```bash
rm -rf node_modules package-lock.json
npm install
```

### Port 3000 déjà utilisé
```bash
npm run dev -- --port 3001
```

### Erreur CORS avec l'API
Le site WordPress doit autoriser les requêtes depuis localhost. Vérifier les headers CORS côté WordPress.

### Le build échoue
```bash
npm run build 2>&1 | tee build.log
```
Puis analyser le fichier `build.log`.

---

## 📚 Technologies

- **Nuxt 4** - Framework Vue.js avec SSR
- **Vue 3** - Framework JavaScript réactif
- **WPGraphQL** - API GraphQL pour WordPress
- **SCSS** - Préprocesseur CSS
- **@nuxt/image** - Optimisation des images
- **@vueuse/motion** - Animations

---

## 📝 Licence

Projet privé - Japan Conventions © 2025
