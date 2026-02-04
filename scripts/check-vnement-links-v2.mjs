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
          uri
          detailsEvenement {
            urlBilletterie
            urlExposant
          }
        }
      }
    }
    `);

    if (res.errors) {
        console.error("GraphQL Errors:", res.errors);
        return;
    }

    if (!res.data || !res.data.vNements) {
        console.error("No data found. Checking schema for vNements type...");
        const schema = await query(`query { __type(name: "RootQuery") { fields { name } } }`);
        console.log("RootQuery fields:", schema.data.__type.fields.map(f => f.name));
        return;
    }

    res.data.vNements.nodes.forEach(v => {
        console.log(`vNement: ${v.title} (${v.slug})`);
        console.log(`  - Billetterie: ${v.detailsEvenement?.urlBilletterie}`);
        console.log(`  - Exposant: ${v.detailsEvenement?.urlExposant}`);
    });
}

main();
