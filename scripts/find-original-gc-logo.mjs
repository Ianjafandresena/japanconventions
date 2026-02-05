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
    console.log("🔍 Recherche intensive du logo original Gamer Connection (néon)...\n");

    // On cherche Gamer Connection ou GC
    const res = await query(`
    query {
      mediaItems(where: {search: "gamer connection"}, first: 50) {
        nodes {
          sourceUrl
          title
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
            console.log(`- ${m.title} (${m.mediaDetails?.width}x${m.mediaDetails?.height})`);
            console.log(`  URL: ${m.sourceUrl}`);
        });
    }
}

main();
