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
    console.log("🔍 Recherche des fichiers originaux SANS redimensionnement...\n");

    const searches = [
        'Japan-Otaku-festival-Logo',
        'LOGO-JMW',
        'gamer-connection-logo',
        'logotatouage',
        'logoFever'
    ];

    for (const term of searches) {
        console.log(`\n--- ${term} ---`);
        const res = await query(`
        query {
          mediaItems(where: {search: "${term}"}, first: 10) {
            nodes {
              sourceUrl
              title
              databaseId
              mediaDetails {
                width
                height
                file
              }
            }
          }
        }
        `);

        if (res.data?.mediaItems?.nodes) {
            res.data.mediaItems.nodes.forEach(m => {
                console.log(`[${m.databaseId}] ${m.title}`);
                console.log(`URL: ${m.sourceUrl}`);
                console.log(`Dim: ${m.mediaDetails?.width}x${m.mediaDetails?.height}`);
            });
        }
    }
}

main();
