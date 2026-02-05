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
    const res = await query(`
    query {
      pages(where: {id: 28399}) {
        nodes {
          children {
            nodes {
              ... on Page {
                title
                slug
                detailsFestival {
                  idLogo
                  couleurAccent
                }
              }
            }
          }
        }
      }
    }
    `);

    if (res.data?.pages?.nodes[0]?.children?.nodes) {
        res.data.pages.nodes[0].children.nodes.forEach(n => {
            console.log(`Festival: ${n.title}`);
            console.log(`Slug: ${n.slug}`);
            console.log(`idLogo: ${JSON.stringify(n.detailsFestival?.idLogo)}`);
            console.log(`couleurAccent: ${n.detailsFestival?.couleurAccent}`);
            console.log('---');
        });
    }
}

main();
