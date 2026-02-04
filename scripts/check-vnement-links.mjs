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
    console.log("🔍 Exploration des vNements...");
    const data = await query(`
    query {
      vNements(first: 10) {
        nodes {
          title
          slug
          databaseId
          detailsEvenement {
            nomDuLieu
            urlBilletterie
            urlExposant
          }
        }
      }
    }
    `);

    data.data.vNements.nodes.forEach(v => {
        console.log(`vNement: ${v.title} (${v.slug})`);
        console.log(`- Billetterie: ${v.detailsEvenement?.urlBilletterie}`);
        console.log(`- Exposant: ${v.detailsEvenement?.urlExposant}`);
    });
}

main();
