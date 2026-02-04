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
    console.log("🔍 Vérification brute des festivals...");

    const res = await query(`
    query {
      festivals(first: 10) {
        nodes {
          title
          slug
          detailsFestival {
            statut
          }
        }
      }
    }
    `);

    if (res.data?.festivals?.nodes) {
        res.data.festivals.nodes.forEach(f => {
            console.log(`Festival: ${f.title}`);
            console.log(`Statut details:`, JSON.stringify(f.detailsFestival.statut));
        });
    }
}

main();
