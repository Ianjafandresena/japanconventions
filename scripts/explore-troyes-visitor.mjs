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
    console.log("🔍 Exploration des pages Troyes...");
    const data = await query(`
    query {
      page(id: "/japan-otaku-festival/troyes/", idType: URI) {
        id
        title
        uri
        children(first: 50) {
          nodes {
            ... on Page {
              id
              title
              slug
              uri
              content
            }
          }
        }
      }
    }
    `);

    if (data.data?.page) {
        console.log(`Page: ${data.data.page.title} (${data.data.page.uri})`);
        data.data.page.children.nodes.forEach(child => {
            console.log(`- ${child.title} (${child.uri})`);
            if (child.slug === 'visiteur') {
                console.log("  --- CONTENT PREVIEW ---");
                console.log(child.content?.substring(0, 500));
            }
        });
    } else {
        console.log("Page non trouvée ou erreur:", data.errors);
    }
}

main();
