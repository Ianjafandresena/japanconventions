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
    const data = await query(`
    query {
      pages(first: 100) {
        nodes {
          title
          uri
          slug
        }
      }
    }
    `);

    data.data.pages.nodes.forEach(p => {
        console.log(`${p.title} -> ${p.uri}`);
    });
}

main();
