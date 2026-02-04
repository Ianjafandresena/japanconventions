/**
 * Script d'exploration du schéma GraphQL WordPress
 * Identifie les types, Custom Post Types, ACF et WooCommerce disponibles
 */

const GRAPHQL_URL = 'https://japanconventions.com/graphql';

// Requête d'introspection pour obtenir tous les types disponibles
const INTROSPECTION_QUERY = `
query IntrospectionQuery {
  __schema {
    types {
      name
      kind
      description
      fields {
        name
        type {
          name
          kind
          ofType {
            name
            kind
          }
        }
      }
    }
    queryType {
      fields {
        name
        description
        type {
          name
          kind
        }
      }
    }
  }
}
`;

// Requête pour voir les menus disponibles
const MENUS_QUERY = `
query GetMenus {
  menus {
    nodes {
      id
      name
      slug
      menuItems {
        nodes {
          id
          label
          url
          parentId
        }
      }
    }
  }
}
`;

// Requête pour voir les types de contenu
const CONTENT_TYPES_QUERY = `
query GetContentTypes {
  contentTypes {
    nodes {
      name
      label
      description
      graphqlSingleName
      graphqlPluralName
    }
  }
}
`;

// Requête pour tester les pages principales
const PAGES_QUERY = `
query GetPages {
  pages(first: 20, where: {parent: null}) {
    nodes {
      id
      title
      slug
      uri
      template {
        templateName
      }
      children {
        nodes {
          ... on Page {
            id
            title
            slug
          }
        }
      }
    }
  }
}
`;

// Requête pour les produits WooCommerce (si disponible)
const PRODUCTS_QUERY = `
query GetProducts {
  products(first: 5) {
    nodes {
      id
      name
      slug
      ... on SimpleProduct {
        price
      }
    }
  }
}
`;

// Requête pour les settings globaux
const SETTINGS_QUERY = `
query GetSettings {
  generalSettings {
    title
    description
    url
    language
  }
}
`;

async function fetchGraphQL(query, label) {
    console.log(`\n${'='.repeat(60)}`);
    console.log(`📡 ${label}`);
    console.log('='.repeat(60));

    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query })
        });

        const data = await response.json();

        if (data.errors) {
            console.log('❌ Erreur:', data.errors[0].message);
            return null;
        }

        return data.data;
    } catch (error) {
        console.log('❌ Erreur réseau:', error.message);
        return null;
    }
}

async function exploreSchema() {
    console.log('\n🔍 EXPLORATION DU SCHÉMA GRAPHQL - JAPAN CONVENTIONS');
    console.log('='.repeat(60));
    console.log(`Endpoint: ${GRAPHQL_URL}`);
    console.log(`Date: ${new Date().toISOString()}`);

    // 1. Settings globaux
    const settings = await fetchGraphQL(SETTINGS_QUERY, 'SETTINGS GLOBAUX');
    if (settings) {
        console.log('✅ Site:', settings.generalSettings.title);
        console.log('   URL:', settings.generalSettings.url);
    }

    // 2. Types de contenu disponibles
    const contentTypes = await fetchGraphQL(CONTENT_TYPES_QUERY, 'TYPES DE CONTENU (CPT)');
    if (contentTypes) {
        console.log('\n📦 Custom Post Types disponibles:');
        contentTypes.contentTypes.nodes.forEach(type => {
            console.log(`   • ${type.label} (${type.graphqlSingleName})`);
        });
    }

    // 3. Menus
    const menus = await fetchGraphQL(MENUS_QUERY, 'MENUS WORDPRESS');
    if (menus && menus.menus?.nodes?.length > 0) {
        console.log('\n🍔 Menus disponibles:');
        menus.menus.nodes.forEach(menu => {
            console.log(`   • ${menu.name} (${menu.menuItems?.nodes?.length || 0} items)`);
            menu.menuItems?.nodes?.slice(0, 5).forEach(item => {
                console.log(`     - ${item.label}: ${item.url}`);
            });
        });
    } else {
        console.log('⚠️ Aucun menu trouvé ou non exposé');
    }

    // 4. Pages principales (structure du site)
    const pages = await fetchGraphQL(PAGES_QUERY, 'PAGES PRINCIPALES');
    if (pages) {
        console.log('\n📄 Pages racine:');
        pages.pages.nodes.forEach(page => {
            const childCount = page.children?.nodes?.length || 0;
            console.log(`   • ${page.title} (${page.uri}) - ${childCount} sous-pages`);
        });
    }

    // 5. Test WooCommerce
    const products = await fetchGraphQL(PRODUCTS_QUERY, 'PRODUITS WOOCOMMERCE');
    if (products && products.products?.nodes?.length > 0) {
        console.log('\n🛒 WooCommerce ACTIF - Produits trouvés:');
        products.products.nodes.forEach(p => {
            console.log(`   • ${p.name} - ${p.price || 'Prix non défini'}`);
        });
    } else {
        console.log('⚠️ WooCommerce GraphQL non disponible ou pas de produits');
    }

    // 6. Introspection complète pour identifier les types utiles
    const schema = await fetchGraphQL(INTROSPECTION_QUERY, 'INTROSPECTION SCHÉMA');
    if (schema) {
        // Filtrer les types utiles (exclure les types internes GraphQL)
        const types = schema.__schema.types.filter(t =>
            !t.name.startsWith('__') &&
            !t.name.startsWith('Wp') &&
            t.kind === 'OBJECT'
        );

        // Chercher les types ACF
        const acfTypes = types.filter(t => t.name.includes('Acf') || t.name.includes('ACF'));
        if (acfTypes.length > 0) {
            console.log('\n🔧 Types ACF trouvés:');
            acfTypes.forEach(t => console.log(`   • ${t.name}`));
        }

        // Chercher les types WooCommerce
        const wooTypes = types.filter(t =>
            t.name.includes('Product') ||
            t.name.includes('Cart') ||
            t.name.includes('Order') ||
            t.name.includes('Customer')
        );
        if (wooTypes.length > 0) {
            console.log('\n🛒 Types WooCommerce trouvés:');
            wooTypes.forEach(t => console.log(`   • ${t.name}`));
        }

        // Chercher les CPT personnalisés
        const cptTypes = types.filter(t =>
            t.name.includes('Event') ||
            t.name.includes('Festival') ||
            t.name.includes('Ticket') ||
            t.name.includes('Sponsor') ||
            t.name.includes('Guest') ||
            t.name.includes('Invité')
        );
        if (cptTypes.length > 0) {
            console.log('\n🎫 Types personnalisés (CPT):');
            cptTypes.forEach(t => console.log(`   • ${t.name}`));
        }

        // Types de requêtes principales disponibles
        console.log('\n📊 Requêtes principales disponibles:');
        const queryFields = schema.__schema.queryType.fields
            .filter(f => !f.name.startsWith('__'))
            .slice(0, 30);

        queryFields.forEach(f => {
            console.log(`   • ${f.name} → ${f.type.name || f.type.kind}`);
        });
    }

    // Résumé final
    console.log('\n' + '='.repeat(60));
    console.log('📋 RÉSUMÉ - DONNÉES UTILES POUR LE HEADLESS');
    console.log('='.repeat(60));
    console.log(`
✅ DONNÉES ESSENTIELLES (à utiliser):
   • pages (festivals, villes, infos)
   • posts (articles presse)
   • menus (navigation)
   • mediaItems (images)
   • generalSettings (config globale)

⚠️ À VÉRIFIER:
   • products (billetterie WooCommerce)
   • ACF fields (champs personnalisés)

❌ À ÉVITER (surcharge inutile):
   • users, comments, revisions
   • Types admin WordPress
   • Données non affichées
`);
}

exploreSchema();
