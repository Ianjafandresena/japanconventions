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
    console.log("🔍 Exploration des pages visiteur existantes...\n");

    // Récupérer la hiérarchie des pages du JOF
    const res = await query(`
    query {
      pages(where: {search: "visiteur"}, first: 50) {
        nodes {
          title
          slug
          uri
          parent {
            node {
              ... on Page {
                title
                slug
              }
            }
          }
        }
      }
    }
    `);

    if (res.data?.pages?.nodes) {
        console.log("📄 Pages Visiteur trouvées:\n");
        res.data.pages.nodes.forEach(p => {
            const parent = p.parent?.node?.title || 'Racine';
            console.log(`- ${p.title}`);
            console.log(`  URI: ${p.uri}`);
            console.log(`  Parent: ${parent}`);
            console.log('');
        });
    } else {
        console.log("Erreur:", res);
    }
}

main();
