# 🔧 Guide d'Installation - WordPress CPTs

> **Version** : 2.0 (Mise à jour avec CPT UI)  
> **Date** : 01 Février 2026  
> **Statut** : ✅ CPT UI déjà installé sur le serveur

---

## 📋 Table des matières

1. [État actuel du serveur](#1-état-actuel-du-serveur)
2. [Configuration CPT UI](#2-configuration-cpt-ui)
3. [Installation ACF](#3-installation-acf)
4. [Configuration des champs ACF](#4-configuration-des-champs-acf)
5. [Création des données](#5-création-des-données)
6. [Test et validation](#6-test-et-validation)

---

## 1. État actuel du serveur

### Plugins déjà installés ✅

| Plugin | Statut | Usage |
|--------|--------|-------|
| **CPT UI** | ✅ Installé | Création des Custom Post Types |
| **WPGraphQL** | ✅ Installé | API GraphQL |
| **Unlimited Elements** | ✅ Installé | - |
| **UpdraftPlus** | ✅ Installé | Sauvegardes |
| **Smush** | ✅ Installé | Optimisation images |
| **Forminator Pro** | ✅ Installé | Formulaires |

### Plugins à installer

| Plugin | Statut | Usage |
|--------|--------|-------|
| **ACF (gratuit)** | ⏳ À installer | Champs personnalisés |
| **WPGraphQL for ACF** | ⏳ À installer | Exposer ACF dans GraphQL |

---

## 2. Configuration CPT UI

### 2.1 Créer le CPT "Festival"

1. Aller dans **CPT UI > Ajouter/modifier des types de publication**
2. Remplir les champs :

**Section "Réglages de base"**

| Champ | Valeur |
|-------|--------|
| Slug du type de publication | `festival` |
| Nom pluriel | `Festivals` |
| Nom singulier | `Festival` |

**Section "Réglages supplémentaires"** (cliquer pour déplier)

| Champ | Valeur |
|-------|--------|
| Public | `true` |
| Afficher dans l'interface | `true` |
| Afficher dans le menu | `true` |
| Afficher dans REST API | `true` |
| Icône du menu | `dashicons-tickets-alt` |
| Supports | `title`, `editor`, `thumbnail` |

**Section "GraphQL"** (WPGraphQL)

| Champ | Valeur |
|-------|--------|
| Afficher dans GraphQL | ✅ `true` |
| Nom singulier GraphQL | `festival` |
| Nom pluriel GraphQL | `festivals` |

3. Cliquer **Ajouter le type de publication**

---

### 2.2 Créer le CPT "Événement"

1. Même procédure dans **CPT UI > Ajouter/modifier des types de publication**

**Section "Réglages de base"**

| Champ | Valeur |
|-------|--------|
| Slug du type de publication | `evenement` |
| Nom pluriel | `Événements` |
| Nom singulier | `Événement` |

**Section "Réglages supplémentaires"**

| Champ | Valeur |
|-------|--------|
| Public | `true` |
| Afficher dans l'interface | `true` |
| Afficher dans le menu | `true` |
| Afficher dans REST API | `true` |
| Icône du menu | `dashicons-calendar-alt` |
| Supports | `title`, `editor`, `thumbnail` |

**Section "GraphQL"**

| Champ | Valeur |
|-------|--------|
| Afficher dans GraphQL | ✅ `true` |
| Nom singulier GraphQL | `evenement` |
| Nom pluriel GraphQL | `evenements` |

2. Cliquer **Ajouter le type de publication**

---

### 2.3 Créer la Taxonomie "Ville"

1. Aller dans **CPT UI > Ajouter/modifier des taxonomies**

**Section "Réglages de base"**

| Champ | Valeur |
|-------|--------|
| Slug de la taxonomie | `ville` |
| Nom pluriel | `Villes` |
| Nom singulier | `Ville` |
| Attacher au type de publication | `evenement` ✅ |

**Section "GraphQL"**

| Champ | Valeur |
|-------|--------|
| Afficher dans GraphQL | ✅ `true` |
| Nom singulier GraphQL | `ville` |
| Nom pluriel GraphQL | `villes` |

2. Cliquer **Ajouter la taxonomie**

---

### 2.4 Vérification CPT UI

Après les 3 créations, vous devriez voir dans le menu WordPress :
- 📌 **Festivals** (icône tickets)
- 📅 **Événements** (icône calendrier)
- 🏙️ **Événements > Villes** (sous-menu)

---

## 3. Installation ACF

### 3.1 Télécharger ACF (gratuit)

1. Aller dans **Extensions > Ajouter**
2. Rechercher "**Advanced Custom Fields**"
3. Installer le plugin de **Delicious Brains** (le premier résultat)
4. Cliquer **Activer**

### 3.2 Télécharger WPGraphQL for ACF

1. Aller sur https://github.com/wp-graphql/wpgraphql-acf/releases
2. Télécharger le ZIP de la dernière version
3. Aller dans **Extensions > Ajouter > Téléverser**
4. Uploader le ZIP
5. Activer le plugin

---

## 4. Configuration des champs ACF

### 4.1 Groupe de champs : Festival

1. Aller dans **ACF > Groupes de champs**
2. Cliquer **Ajouter**
3. Titre : `Détails Festival`

**Ajouter les champs :**

| Nom du champ | Type | Clé | GraphQL |
|--------------|------|-----|---------|
| ID du Logo | Select | `logo_id` | ✅ Exposer |
| Couleur | Color Picker | `color` | ✅ Exposer |
| Statut | Select | `status` | ✅ Exposer |

**Configuration du champ "ID du Logo"** (Select)

| Option |
|--------|
| `jof : Japan Otaku Festival` |
| `jmw : Japan Manga Wave` |
| `gc : Gamer Connection` |
| `ink : Ink Secret` |
| `one : One Night Event` |

**Configuration du champ "Statut"** (Select)

| Option |
|--------|
| `active : Actif` |
| `inactive : Inactif` |

**Règles d'emplacement :**
- Type de publication = `festival`

4. Cliquer **Publier**

---

### 4.2 Groupe de champs : Événement

1. Aller dans **ACF > Groupes de champs**
2. Cliquer **Ajouter**
3. Titre : `Détails Événement`

**Ajouter les champs :**

| Nom du champ | Type | Clé | GraphQL |
|--------------|------|-----|---------|
| Festival parent | Post Object | `festival_id` | ✅ Exposer |
| Nom du lieu | Text | `lieu_nom` | ✅ Exposer |
| Date de début | Date Picker | `date_debut` | ✅ Exposer |
| Date de fin | Date Picker | `date_fin` | ✅ Exposer |
| URL Billetterie | URL | `billetterie_url` | ✅ Exposer |
| Statut | Select | `statut` | ✅ Exposer |

**Configuration du champ "Festival parent"** (Post Object)

| Paramètre | Valeur |
|-----------|--------|
| Type de contenu à filtrer | `festival` |
| Retour | ID |

**Configuration du champ "Statut"** (Select)

| Option |
|--------|
| `a_venir : À venir` |
| `en_cours : En cours` |
| `termine : Terminé` |
| `annule : Annulé` |

**Règles d'emplacement :**
- Type de publication = `evenement`

4. Cliquer **Publier**

---

## 5. Création des données

### 5.1 Créer les 5 Festivals

Aller dans **Festivals > Ajouter** et créer :

| Titre | Slug | Logo ID | Couleur | Statut |
|-------|------|---------|---------|--------|
| Japan Otaku Festival | japan-otaku-festival | `jof` | `#e60012` | Actif |
| Japan Manga Wave | japan-manga-wave | `jmw` | `#e60012` | Actif |
| Gamer Connection | gamer-connection | `gc` | `#00ff88` | Actif |
| Ink Secret | ink-secret | `ink` | `#8b00ff` | Actif |
| One Night Event | one-night-event | `one` | `#ffd700` | Actif |

### 5.2 Créer les Villes

Aller dans **Événements > Villes** et ajouter :

```
Albi, Aubagne, Caen, Castres, Chambéry, Châlons-en-Champagne, 
Douai, Évreux, La Roche-sur-Yon, Marseille, Nevers, Nice, 
Niort, Paris, Rennes, Rouen, Saint-Étienne, Strasbourg, Troyes
```

### 5.3 Créer les Événements JOF

Aller dans **Événements > Ajouter** :

| Titre | Festival | Ville | Lieu | Début | Fin |
|-------|----------|-------|------|-------|-----|
| JOF Albi 2025 | Japan Otaku Festival | Albi | Parc Expo | 2025-01-31 | 2025-02-01 |
| JOF Troyes 2025 | Japan Otaku Festival | Troyes | Le Cube | 2025-02-14 | 2025-02-15 |
| JOF Chambéry 2026 | Japan Otaku Festival | Chambéry | Savoi Expo | 2026-02-28 | 2026-03-01 |
| JOF La Roche-sur-Yon | Japan Otaku Festival | La Roche-sur-Yon | Parc Expo | 2026-03-28 | 2026-03-29 |
| JOF Châlons | Japan Otaku Festival | Châlons-en-Champagne | La Capitole | 2026-04-04 | 2026-04-05 |
| JOF Marseille 2026 | Japan Otaku Festival | Marseille | Palais des Sports | 2026-05-01 | 2026-05-03 |
| JOF Rouen | Japan Otaku Festival | Rouen | Parc Expo | À définir | À définir |
| JOF Nevers | Japan Otaku Festival | Nevers | Parc Expo | À définir | À définir |
| JOF Niort | Japan Otaku Festival | Niort | Parc Expo | À définir | À définir |
| JOF Évreux | Japan Otaku Festival | Évreux | Halle des Expos | À définir | À définir |

---

## 6. Test et validation

### 6.1 Requête GraphQL de test

Aller dans **GraphQL > GraphiQL IDE** et exécuter :

```graphql
query TestCPTs {
  festivals(first: 10) {
    nodes {
      databaseId
      title
      slug
      detailsFestival {
        logoId
        color
        status
      }
    }
  }
  evenements(first: 10) {
    nodes {
      databaseId
      title
      slug
      detailsEvenement {
        festivalId
        lieuNom
        dateDebut
        dateFin
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

### 6.2 Résultat attendu

```json
{
  "data": {
    "festivals": {
      "nodes": [
        {
          "databaseId": 123,
          "title": "Japan Otaku Festival",
          "slug": "japan-otaku-festival",
          "detailsFestival": {
            "logoId": "jof",
            "color": "#e60012",
            "status": "active"
          }
        }
      ]
    },
    "evenements": {
      "nodes": [
        {
          "databaseId": 456,
          "title": "JOF Albi 2025",
          "slug": "jof-albi-2025",
          "detailsEvenement": {
            "festivalId": 123,
            "lieuNom": "Parc Expo",
            "dateDebut": "2025-01-31",
            "dateFin": "2025-02-01",
            "statut": "a_venir"
          },
          "villes": {
            "nodes": [
              { "name": "Albi", "slug": "albi" }
            ]
          }
        }
      ]
    }
  }
}
```

---

## 📋 Checklist récapitulative

### Backend WordPress

- [ ] CPT "festival" créé via CPT UI
- [ ] CPT "evenement" créé via CPT UI
- [ ] Taxonomie "ville" créée via CPT UI
- [ ] ACF installé et activé
- [ ] WPGraphQL for ACF installé et activé
- [ ] Groupe de champs "Détails Festival" créé
- [ ] Groupe de champs "Détails Événement" créé
- [ ] 5 festivals créés
- [ ] Villes créées
- [ ] Événements créés
- [ ] Test GraphQL validé ✅

---

## 🔧 Dépannage

### Les CPTs n'apparaissent pas dans GraphQL

1. Vérifier dans CPT UI que "Afficher dans GraphQL" est coché
2. Aller dans **Réglages > Permaliens** et sauvegarder (vide le cache)

### Les champs ACF n'apparaissent pas dans GraphQL

1. Vérifier que WPGraphQL for ACF est activé
2. Dans chaque champ ACF, cocher "Exposer dans GraphQL"
3. Vérifier le nom du groupe de champs (utilisé dans la requête)

---

> **Dernière mise à jour** : 01/02/2026  
> **Version** : 2.0 (avec CPT UI)
