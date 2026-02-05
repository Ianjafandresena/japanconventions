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
    console.log("🔍 Recherche de tous les médias pour trouver le logo néon...\n");
    const res = await query(`
    query {
      mediaItems(first: 100) {
        nodes {
          sourceUrl
          title
          mimeType
        }
      }
    }
    `);

    if (res.data?.mediaItems?.nodes) {
        res.data.mediaItems.nodes.forEach(m => {
            if (m.title.toLowerCase().includes('logo') || m.title.toLowerCase().includes('gc') || m.title.toLowerCase().includes('gamer')) {
                console.log(`- ${m.title} [${m.mimeType}] -> ${m.sourceUrl}`);
            }
        });
    }
}

main();
