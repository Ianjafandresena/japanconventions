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
      vNements(first: 20) {
        nodes {
          title
          slug
          detailsEvenement {
            urlBilletterie
          }
        }
      }
    }
    `);

    res.data.vNements.nodes.forEach(v => {
        console.log(`${v.title} -> ${v.detailsEvenement?.urlBilletterie}`);
    });
}

main();
