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
    console.log("🔍 Recherche des derniers médias uploadés...\n");

    // On cherche les 50 derniers médias
    const res = await query(`
    query {
      mediaItems(first: 50) {
        nodes {
          sourceUrl
          title
          mimeType
          mediaDetails {
            width
            height
          }
        }
      }
    }
    `);

    if (res.data?.mediaItems?.nodes) {
        res.data.mediaItems.nodes.forEach(m => {
            console.log(`- ${m.title} (${m.mimeType}) ${m.mediaDetails?.width}x${m.mediaDetails?.height}`);
            console.log(`  URL: ${m.sourceUrl}`);
        });
    }
}

main();
