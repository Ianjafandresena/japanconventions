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
    console.log("🔍 Exploration des produits (Pass)...");
    const res = await query(`
    query {
      products(first: 20) {
        nodes {
          id
          databaseId
          name
          slug
          shortDescription
          image {
            sourceUrl
          }
          ... on SimpleProduct {
            price
            regularPrice
          }
          productCategories {
            nodes {
              name
              slug
            }
          }
        }
      }
    }
    `);

    if (res.errors) {
        console.error("GraphQL Errors:", res.errors);
        return;
    }

    if (res.data?.products?.nodes) {
        res.data.products.nodes.forEach(p => {
            const cats = p.productCategories?.nodes.map(c => c.name).join(', ');
            console.log(`Produit: ${p.name} (${p.slug})`);
            console.log(`  - Prix: ${p.price}`);
            console.log(`  - Catégories: ${cats}`);
        });
    } else {
        console.log("Aucun produit trouvé.");
    }
}

main();
