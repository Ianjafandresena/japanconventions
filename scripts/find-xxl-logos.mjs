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
    console.log("🔍 Recherche des versions XXL et PNG transparents...\n");

    // On cherche tout ce qui est MediaItem
    const res = await query(`
    query {
      mediaItems(first: 100, where: {search: "logo"}) {
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
            if (m.mediaDetails?.width > 1000) {
                console.log(`- ${m.title} (${m.mediaDetails.width}x${m.mediaDetails.height})`);
                console.log(`  URL: ${m.sourceUrl}`);
            }
        });
    }
}

main();
