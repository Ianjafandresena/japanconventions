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
    console.log("🔍 Recherche des versions PNG TRANSPARENTES...\n");

    // On cherche tout ce qui est MediaItem avec PNG
    const res = await query(`
    query {
      mediaItems(first: 100, where: {search: "logo"}) {
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
            if (m.mimeType === 'image/png') {
                console.log(`- ${m.title} (${m.mediaDetails?.width}x${m.mediaDetails?.height})`);
                console.log(`  URL: ${m.sourceUrl}`);
            }
        });
    }

    console.log("\n🔍 Recherche spécifique pour Ink et Fever en PNG...\n");
    const res2 = await query(`
    query {
      mediaItems(first: 20, where: {search: "ink"}) {
        nodes {
          sourceUrl
          title
          mimeType
          mediaDetails { width height }
        }
      }
    }
    `);
    if (res2.data?.mediaItems?.nodes) {
        res2.data.mediaItems.nodes.forEach(m => {
            if (m.mimeType === 'image/png') {
                console.log(`- ${m.title} (${m.mediaDetails?.width}x${m.mediaDetails?.height})`);
                console.log(`  URL: ${m.sourceUrl}`);
            }
        });
    }

    const res3 = await query(`
    query {
      mediaItems(first: 20, where: {search: "fever"}) {
        nodes {
          sourceUrl
          title
          mimeType
          mediaDetails { width height }
        }
      }
    }
    `);
    if (res3.data?.mediaItems?.nodes) {
        res3.data.mediaItems.nodes.forEach(m => {
            if (m.mimeType === 'image/png') {
                console.log(`- ${m.title} (${m.mediaDetails?.width}x${m.mediaDetails?.height})`);
                console.log(`  URL: ${m.sourceUrl}`);
            }
        });
    }
}

main();
