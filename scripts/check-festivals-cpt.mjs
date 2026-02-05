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
    console.log("🔍 Fetching raw data from Custom Post Type 'festivals'...\n");
    const res = await query(`
    query {
      festivals(first: 50) {
        nodes {
          databaseId
          title
          slug
          detailsFestival {
            idLogo
            color
            statut
          }
        }
      }
    }
    `);

    if (res.data?.festivals?.nodes) {
        res.data.festivals.nodes.forEach(n => {
            console.log(`Festival: ${n.title} (${n.databaseId})`);
            console.log(`  Slug: ${n.slug}`);
            console.log(`  idLogo: ${JSON.stringify(n.detailsFestival?.idLogo)}`);
            console.log(`  color: ${n.detailsFestival?.color}`);
            console.log('  ---');
        });
    }
}

main();
