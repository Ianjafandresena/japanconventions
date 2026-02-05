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
    const res = await query(`
    query {
      mediaItems(first: 500) {
        nodes {
          sourceUrl
          title
          mimeType
          mediaDetails { width height }
        }
      }
    }
    `);

    if (res.data?.mediaItems?.nodes) {
        res.data.mediaItems.nodes.forEach(m => {
            const t = m.title.toLowerCase();
            if (t.includes('gamer') || t.includes('connection') || t.includes('gc') || t.includes('neon')) {
                console.log(`Match: ${m.title} (${m.mediaDetails?.width}x${m.mediaDetails?.height}) -> ${m.sourceUrl}`);
            }
        });
    }
}

main();
