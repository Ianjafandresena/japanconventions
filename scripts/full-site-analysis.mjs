const GRAPHQL_URL = 'https://japanconventions.com/graphql';

async function query(gql) {
    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gql })
    });
    return await res.json();
}

async function main() {
    console.log("🔍 ANALYSE COMPLÈTE DU SITE OFFICIEL JAPANCONVENTIONS.COM");
    console.log("=".repeat(80));

    // 1. Types de contenu disponibles
    console.log("\n\n📦 1. TYPES DE CONTENU (Content Types)");
    console.log("-".repeat(60));

    const typesRes = await query(`
    query {
      __schema {
        queryType {
          fields {
            name
            description
          }
        }
      }
    }
    `);

    const relevantTypes = typesRes.data?.__schema?.queryType?.fields
        ?.filter(f => !f.name.startsWith('__') && !f.name.includes('Setting'))
        ?.slice(0, 30);

    if (relevantTypes) {
        relevantTypes.forEach(t => {
            console.log(`  - ${t.name}`);
        });
    }

    // 2. Produits WooCommerce
    console.log("\n\n🛍️ 2. PRODUITS WOOCOMMERCE (Billetterie)");
    console.log("-".repeat(60));

    const productsRes = await query(`
    query {
      products(first: 20) {
        nodes {
          ... on SimpleProduct {
            name
            slug
            price
            productCategories {
              nodes {
                name
                slug
              }
            }
          }
        }
      }
    }
    `);

    if (productsRes.data?.products?.nodes) {
        const products = productsRes.data.products.nodes;
        console.log(`  Total produits récupérés: ${products.length}`);

        // Grouper par catégorie
        const byCategory = {};
        products.forEach(p => {
            if (p.name) {
                const cat = p.productCategories?.nodes?.[0]?.name || 'Sans catégorie';
                if (!byCategory[cat]) byCategory[cat] = [];
                byCategory[cat].push({ name: p.name, price: p.price, slug: p.slug });
            }
        });

        for (const [cat, prods] of Object.entries(byCategory)) {
            console.log(`\n  📁 ${cat}:`);
            prods.slice(0, 5).forEach(p => {
                console.log(`     - ${p.name} (${p.price || 'Prix N/A'})`);
            });
            if (prods.length > 5) console.log(`     ... et ${prods.length - 5} autres`);
        }
    } else {
        console.log("  ⚠️ Produits non accessibles via GraphQL public");
        if (productsRes.errors) console.log(`  Erreur: ${productsRes.errors[0]?.message}`);
    }

    // 3. Catégories de produits
    console.log("\n\n📂 3. CATÉGORIES DE PRODUITS");
    console.log("-".repeat(60));

    const catRes = await query(`
    query {
      productCategories(first: 50) {
        nodes {
          name
          slug
          count
        }
      }
    }
    `);

    if (catRes.data?.productCategories?.nodes) {
        catRes.data.productCategories.nodes
            .filter(c => c.count > 0)
            .sort((a, b) => b.count - a.count)
            .forEach(c => {
                console.log(`  - ${c.name} (${c.count} produits) → slug: ${c.slug}`);
            });
    }

    // 4. Menus
    console.log("\n\n🧭 4. MENUS DE NAVIGATION");
    console.log("-".repeat(60));

    const menuRes = await query(`
    query {
      menus {
        nodes {
          name
          menuItems {
            nodes {
              label
              url
            }
          }
        }
      }
    }
    `);

    if (menuRes.data?.menus?.nodes) {
        menuRes.data.menus.nodes.forEach(menu => {
            console.log(`\n  📋 ${menu.name}:`);
            menu.menuItems?.nodes?.slice(0, 10).forEach(item => {
                console.log(`     - ${item.label}: ${item.url}`);
            });
        });
    }

    // 5. Pages exposant
    console.log("\n\n👔 5. PAGES EXPOSANT");
    console.log("-".repeat(60));

    const exposantRes = await query(`
    query {
      pages(where: {search: "exposant"}, first: 30) {
        nodes {
          title
          uri
        }
      }
    }
    `);

    if (exposantRes.data?.pages?.nodes) {
        exposantRes.data.pages.nodes
            .filter(p => p.title.toLowerCase().includes('exposant') || p.uri.includes('exposant'))
            .forEach(p => {
                console.log(`  - ${p.title}`);
                console.log(`    URI: ${p.uri}`);
            });
    }

    // 6. Posts (Presse)
    console.log("\n\n📰 6. ARTICLES DE PRESSE");
    console.log("-".repeat(60));

    const postsRes = await query(`
    query {
      posts(first: 5, where: {orderby: {field: DATE, order: DESC}}) {
        nodes {
          title
          date
          slug
          categories {
            nodes {
              name
            }
          }
        }
      }
    }
    `);

    if (postsRes.data?.posts?.nodes) {
        postsRes.data.posts.nodes.forEach(p => {
            const cats = p.categories?.nodes?.map(c => c.name).join(', ') || '';
            console.log(`  - ${p.title}`);
            console.log(`    Date: ${p.date?.split('T')[0]} | Catégories: ${cats}`);
        });
    }

    // 7. Vos CPTs personnalisés
    console.log("\n\n🎯 7. VOS CPTs PERSONNALISÉS");
    console.log("-".repeat(60));

    const festivalsRes = await query(`
    query {
      festivals(first: 10) {
        nodes {
          title
          slug
        }
      }
    }
    `);

    if (festivalsRes.data?.festivals?.nodes) {
        console.log("\n  🎪 CPT Festivals:");
        festivalsRes.data.festivals.nodes.forEach(f => {
            console.log(`     - ${f.title} (/${f.slug}/)`);
        });
    }

    const evenementsRes = await query(`
    query {
      vNements(first: 10) {
        nodes {
          title
          slug
          villes {
            nodes {
              name
            }
          }
        }
      }
    }
    `);

    if (evenementsRes.data?.vNements?.nodes) {
        console.log("\n  📅 CPT Événements:");
        evenementsRes.data.vNements.nodes.forEach(e => {
            const ville = e.villes?.nodes?.[0]?.name || 'Ville N/A';
            console.log(`     - ${e.title} (Ville: ${ville})`);
        });
    }

    // 8. Taxonomies
    console.log("\n\n🏷️ 8. TAXONOMIE VILLES");
    console.log("-".repeat(60));

    const villesRes = await query(`
    query {
      villes(first: 20) {
        nodes {
          name
          slug
          count
        }
      }
    }
    `);

    if (villesRes.data?.villes?.nodes) {
        villesRes.data.villes.nodes.forEach(v => {
            console.log(`  - ${v.name} (slug: ${v.slug}, utilisations: ${v.count})`);
        });
    }

    console.log("\n\n" + "=".repeat(80));
    console.log("✅ ANALYSE TERMINÉE");
    console.log("=".repeat(80));
}

main();
