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
    console.log("🔍 Recherche de versions PNG de Gamer Connection et Ink Secret...\n");

    const searches = ['gamer', 'connection', 'ink', 'secret', 'fever', 'waves'];

    for (const term of searches) {
        const res = await query(`
        query {
          mediaItems(where: {search: "${term}"}, first: 20) {
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
                if (m.mimeType === 'image/png' && m.mediaDetails?.width > 400) {
                    console.log(`[PNG FOUND] ${m.title} (${m.mediaDetails.width}x${m.mediaDetails.height})`);
                    console.log(`URL: ${m.sourceUrl}`);
                }
            });
        }
    }
}

main();
