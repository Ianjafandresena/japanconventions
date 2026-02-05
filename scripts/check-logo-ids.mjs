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
    console.log("🔍 Vérification des logos des festivals...\n");

    const res = await query(`
    query {
      festivals(first: 100) {
        nodes {
          title
          slug
          detailsFestival {
            idLogo
          }
        }
      }
    }
    `);

    if (res.data?.festivals?.nodes) {
        for (const f of res.data.festivals.nodes) {
            console.log(`Festival: ${f.title}`);
            console.log(`Slug: ${f.slug}`);
            console.log(`idLogo: ${JSON.stringify(f.detailsFestival.idLogo)}`);

            // Si on a un ID, essayons de trouver le média associé
            if (f.detailsFestival.idLogo && f.detailsFestival.idLogo.length > 0) {
                const id = f.detailsFestival.idLogo[0];
                // Note: idLogo seems to be a slug/string identifier in ACF, not a numeric ID
                // Let's try to search for a media item by title/name if it's not a numeric ID
            }
            console.log('-'.repeat(40));
        }
    } else {
        console.log("Erreur:", res);
    }
}

main();
