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
    console.log("🔍 Exploration des pages JoF...");
    const res = await query(`
    query {
      page(id: "/japan-otaku-festival/", idType: URI) {
        title
        uri
        children(first: 100) {
          nodes {
            ... on Page {
              title
              slug
              uri
              children(first: 50) {
                nodes {
                  ... on Page {
                    title
                    slug
                    uri
                  }
                }
              }
            }
          }
        }
      }
    }
    `);

    if (res.data?.page) {
        console.log(`Festival: ${res.data.page.title} (${res.data.page.uri})`);
        res.data.page.children.nodes.forEach(c => {
            console.log(`  └─ ${c.title} (${c.uri})`);
            if (c.children?.nodes) {
                c.children.nodes.forEach(cc => {
                    console.log(`    └─ ${cc.title} (${cc.uri})`);
                });
            }
        });
    } else {
        console.log("Page JoF non trouvée.");
    }
}

main();
