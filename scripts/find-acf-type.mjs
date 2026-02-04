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
    console.log("🔍 Exploration d'un vNement pour trouver le type ACF...");
    const res = await query(`
    query {
      vNements(first: 1) {
        nodes {
          detailsEvenement {
            __typename
          }
        }
      }
    }
    `);

    if (res.data?.vNements?.nodes?.[0]) {
        console.log("Typename detailsEvenement:", res.data.vNements.nodes[0].detailsEvenement.__typename);
        const typeName = res.data.vNements.nodes[0].detailsEvenement.__typename;

        console.log(`\n🔍 Exploration des champs de ${typeName}...`);
        const schema = await query(`
        query {
          __type(name: "${typeName}") {
            fields {
              name
            }
          }
        }
        `);

        if (schema.data?.__type?.fields) {
            schema.data.__type.fields.forEach(f => console.log(`- ${f.name}`));
        } else {
            console.log("Champs non trouvés pour ce type.");
        }
    } else {
        console.log("vNement non trouvé ou erreur:", res.errors);
    }
}

main();
