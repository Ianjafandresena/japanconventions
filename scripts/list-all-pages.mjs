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
      pages(first: 50) {
        nodes {
          databaseId
          title
          slug
        }
      }
    }
    `);

  if (res.data?.pages?.nodes) {
    res.data.pages.nodes.forEach(p => {
      console.log(`- ${p.title} (${p.databaseId}) [${p.slug}]`);
    });
  }
}

main();
