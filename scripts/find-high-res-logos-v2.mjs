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
    console.log("🔍 Recherche approfondie des versions haute résolution...\n");

    // On essaie de trouver les fichiers originaux (non redimensionnés)
    const queries = [
        'Japan-Otaku-festival-Logo',
        'LOGO-JMW',
        'gamer-connection-logo',
        'logotatouage',
        'logoFever'
    ];

    for (const term of queries) {
        const res = await query(`
        query {
          mediaItems(where: {search: "${term}"}, first: 20) {
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
                if (m.mediaDetails && m.mediaDetails.width > 500) {
                    console.log(`[FOUND] ${m.title}`);
                    console.log(`URL: ${m.sourceUrl}`);
                    console.log(`Size: ${m.mediaDetails.width}x${m.mediaDetails.height}`);
                    console.log('---');
                }
            });
        }
    }
}

main();
