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
    console.log("🔍 Exploration des ContentNodes pour trouver les produits...");
    const res = await query(`
    query {
      contentNodes(first: 20) {
        nodes {
          __typename
          slug
          uri
          ... on Page {
            title
          }
          ... on Post {
            title
          }
        }
      }
    }
    `);

    if (res.data?.contentNodes?.nodes) {
        res.data.contentNodes.nodes.forEach(n => {
            console.log(`Node [${n.__typename}]: ${n.slug} -> ${n.uri}`);
        });
    } else {
        console.log("Aucun node trouvé ou erreur:", res.errors);
    }
}

main();
