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
    console.log("🔍 Recherche des logos avec mots clés...\n");
    const terms = ['gamer', 'connection', 'gc', 'neon', 'hub', 'japan'];

    for (const term of terms) {
        const res = await query(`
        query {
          mediaItems(where: {search: "${term}"}, first: 50) {
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
                console.log(`- ${m.title} [${m.mimeType}] -> ${m.sourceUrl}`);
            });
        }
    }
}

main();
