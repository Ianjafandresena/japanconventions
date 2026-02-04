/**
 * Exploration détaillée des données utiles pour le headless
 * Focus: Events CPT, Pages Festivals, Structure du contenu
 */

const GRAPHQL_URL = 'https://japanconventions.com/graphql';

async function query(gql, label) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`📡 ${label}`);
    console.log('─'.repeat(60));

    try {
        const res = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: gql })
        });
        const data = await res.json();

        if (data.errors) {
            console.log('❌', data.errors[0].message);
            return null;
        }
        return data.data;
    } catch (e) {
        console.log('❌ Erreur:', e.message);
        return null;
    }
}

async function main() {
    console.log('🔍 EXPLORATION DÉTAILLÉE - DONNÉES UTILES');
    console.log('═'.repeat(60));

    // 1. EVENTS CPT - Structure complète
    console.log('\n\n📌 1. EVENTS (Custom Post Type)');
    const events = await query(`
    query {
      events(first: 10) {
        nodes {
          id
          databaseId
          title
          slug
          date
          excerpt
          content
          featuredImage {
            node {
              sourceUrl
              altText
            }
          }
        }
      }
    }
  `, 'Events CPT');

    if (events?.events?.nodes?.length > 0) {
        console.log(`✅ ${events.events.nodes.length} événements trouvés:`);
        events.events.nodes.forEach(e => {
            console.log(`   • ${e.title} (ID: ${e.databaseId})`);
            console.log(`     Date: ${e.date}`);
            console.log(`     Image: ${e.featuredImage?.node?.sourceUrl ? '✓' : '✗'}`);
        });
    } else {
        console.log('⚠️ Aucun événement trouvé dans le CPT Events');
    }

    // 2. FESTIVALS - Structure hiérarchique des pages
    console.log('\n\n📌 2. FESTIVALS (Pages principales)');
    const festivals = [
        { slug: 'japan-otaku-festival', name: 'Japan Otaku Festival' },
        { slug: 'japan-manga-wave', name: 'Japan Manga Wave' },
        { slug: 'gamer-connection', name: 'Gamer Connection' },
        { slug: 'ink-secret', name: 'Ink Secret' },
        { slug: 'evenement-a-venir', name: 'One Night Event' }
    ];

    for (const fest of festivals) {
        const data = await query(`
      query {
        page(id: "/${fest.slug}/", idType: URI) {
          id
          title
          content
          featuredImage {
            node { sourceUrl }
          }
          children(first: 50) {
            nodes {
              ... on Page {
                id
                title
                slug
                uri
              }
            }
          }
        }
      }
    `, fest.name);

        if (data?.page) {
            const children = data.page.children?.nodes || [];
            console.log(`\n✅ ${fest.name}`);
            console.log(`   URI: /${fest.slug}/`);
            console.log(`   Image: ${data.page.featuredImage?.node?.sourceUrl ? '✓' : '✗'}`);
            console.log(`   Sous-pages: ${children.length}`);

            // Filtrer les vraies villes (pas les pages admin)
            const cities = children.filter(c => {
                const lower = c.title.toLowerCase();
                return !lower.includes('dossier') &&
                    !lower.includes('exposant') &&
                    !lower.includes('visiteur') &&
                    !lower.includes('benevole') &&
                    !lower.includes('date') &&
                    !lower.includes('accès');
            });

            if (cities.length > 0) {
                console.log(`   🏙️ Villes (${cities.length}):`);
                cities.slice(0, 5).forEach(c => {
                    console.log(`      - ${c.title}`);
                });
                if (cities.length > 5) console.log(`      ... et ${cities.length - 5} autres`);
            }
        } else {
            console.log(`\n❌ ${fest.name} - Page non trouvée`);
        }
    }

    // 3. ARTICLES DE PRESSE
    console.log('\n\n📌 3. ARTICLES DE PRESSE (Posts)');
    const posts = await query(`
    query {
      posts(first: 5, where: {orderby: {field: DATE, order: DESC}}) {
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
  `, 'Posts (Presse)');

    if (posts?.posts?.nodes?.length > 0) {
        console.log(`✅ ${posts.posts.nodes.length} articles récents:`);
        posts.posts.nodes.forEach(p => {
            const cat = p.categories?.nodes?.[0]?.name || 'Sans catégorie';
            console.log(`   • ${p.title}`);
            console.log(`     Date: ${new Date(p.date).toLocaleDateString('fr-FR')}`);
            console.log(`     Catégorie: ${cat}`);
        });
    }

    // 4. MENU PRINCIPAL
    console.log('\n\n📌 4. NAVIGATION (Menus)');
    const menus = await query(`
    query {
      menus {
        nodes {
          id
          name
          slug
          locations
          menuItems(first: 30) {
            nodes {
              id
              label
              url
              path
              parentId
              cssClasses
              childItems {
                nodes {
                  id
                  label
                  url
                  path
                }
              }
            }
          }
        }
      }
    }
  `, 'Menus');

    if (menus?.menus?.nodes?.length > 0) {
        menus.menus.nodes.forEach(menu => {
            console.log(`\n✅ Menu: ${menu.name}`);
            console.log(`   Location: ${menu.locations?.join(', ') || 'Non assigné'}`);

            const topLevel = menu.menuItems?.nodes?.filter(i => !i.parentId) || [];
            topLevel.forEach(item => {
                console.log(`   • ${item.label} → ${item.path || item.url}`);
                const children = item.childItems?.nodes || [];
                children.forEach(child => {
                    console.log(`     └─ ${child.label}`);
                });
            });
        });
    }

    // 5. MEDIA ITEMS (pour comprendre les URLs)
    console.log('\n\n📌 5. MÉDIAS (Images)');
    const media = await query(`
    query {
      mediaItems(first: 3) {
        nodes {
          id
          title
          sourceUrl
          altText
          mediaDetails {
            width
            height
            sizes {
              name
              sourceUrl
              width
              height
            }
          }
        }
      }
    }
  `, 'MediaItems');

    if (media?.mediaItems?.nodes?.length > 0) {
        console.log('✅ Structure des médias:');
        const sample = media.mediaItems.nodes[0];
        console.log(`   Exemple: ${sample.title}`);
        console.log(`   URL: ${sample.sourceUrl}`);
        console.log(`   Dimensions: ${sample.mediaDetails?.width}x${sample.mediaDetails?.height}`);
        console.log(`   Tailles disponibles: ${sample.mediaDetails?.sizes?.map(s => s.name).join(', ')}`);
    }

    // RÉSUMÉ FINAL
    console.log('\n\n' + '═'.repeat(60));
    console.log('📋 SYNTHÈSE - SCHÉMA GRAPHQL UTILE');
    console.log('═'.repeat(60));
    console.log(`
┌─────────────────────────────────────────────────────────────┐
│  DONNÉES À UTILISER (Performance optimale)                  │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ✅ pages         → Festivals + Villes/Événements           │
│  ✅ posts         → Articles de presse                      │
│  ✅ menus         → Navigation (Primary menu)               │
│  ✅ mediaItems    → Images optimisées                       │
│  ✅ events (CPT)  → Événements personnalisés                │
│                                                             │
├─────────────────────────────────────────────────────────────┤
│  ❌ NON DISPONIBLE / À IGNORER                              │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ❌ products      → WooCommerce GraphQL non activé          │
│  ❌ ACF fields    → Introspection désactivée                │
│  ❌ cart/checkout → Rediriger vers WordPress                │
│                                                             │
└─────────────────────────────────────────────────────────────┘

🎯 STRATÉGIE RECOMMANDÉE:

1. PAGES STATIQUES (SSG/ISR):
   - Page d'accueil avec liste des festivals
   - Pages festivals avec liste des villes
   - Page presse avec articles

2. REDIRECTIONS EXTERNES:
   - Billetterie → japanconventions.com/...visiteur/
   - Dossier exposant → japanconventions.com/...exposant/
   - Panier/Checkout → japanconventions.com (WooCommerce)

3. CACHE AGRESSIF:
   - Menus: 24h+ (rarement modifié)
   - Festivals: 1h (structure stable)
   - Articles: 15min (nouveaux articles)
`);
}

main();
