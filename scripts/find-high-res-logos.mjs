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
    console.log("🔍 Recherche des fichiers média originaux...\n");

    // On va chercher les médias dont le titre contient les noms des festivals
    const searchTerms = ['Japan Otaku Festival', 'Japan Manga Wave', 'Gamer Connection', 'Ink Secret', 'Fever'];

    for (const term of searchTerms) {
        console.log(`\nRecherche pour: ${term}`);
        const res = await query(`
        query {
          mediaItems(where: {search: "${term}"}, first: 5) {
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
                console.log(`- ${m.title}`);
                console.log(`  URL: ${m.sourceUrl}`);
                console.log(`  Size: ${m.mediaDetails?.width}x${m.mediaDetails?.height}`);
            });
        }
    }
}

main();
