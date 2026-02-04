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
    console.log("🔍 Exploration des Metadatas d'un vNement...");
    const res = await query(`
    query {
      vNements(first: 1) {
        nodes {
          databaseId
          title
        }
      }
    }
    `);

    if (res.data?.vNements?.nodes?.[0]) {
        const id = res.data.vNements.nodes[0].databaseId;
        console.log(`vNement: ${res.data.vNements.nodes[0].title} (ID: ${id})`);
    }
}

main();
