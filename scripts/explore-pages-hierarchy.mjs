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
    console.log("🔍 Exploration de la hiérarchie des pages Festivals...");
    const res = await query(`
    query {
      pages(where: {parent: 0}, first: 20) {
        nodes {
          title
          slug
          uri
          children(first: 50) {
            nodes {
              ... on Page {
                title
                slug
                uri
                children(first: 20) {
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
    }
    `);

    if (res.data?.pages?.nodes) {
        res.data.pages.nodes.forEach(p => {
            console.log(`Festival Root: ${p.title} (${p.uri})`);
            p.children.nodes.forEach(c => {
                console.log(`  └─ City/Page: ${c.title} (${c.uri})`);
                if (c.children?.nodes) {
                    c.children.nodes.forEach(cc => {
                        console.log(`    └─ Sub: ${cc.title} (${cc.uri})`);
                    });
                }
            });
        });
    } else {
        console.log("Erreur:", res.errors);
    }
}

main();
