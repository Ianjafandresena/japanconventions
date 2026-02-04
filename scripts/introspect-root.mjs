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
    console.log("🔍 Exploration du RootQuery pour trouver comment accéder aux produits...");
    const res = await query(`
    query {
      __type(name: "RootQuery") {
        fields {
          name
        }
      }
    }
    `);

    if (res.data?.__type?.fields) {
        const fields = res.data.__type.fields.map(f => f.name).sort();
        console.log("Champs disponibles dans RootQuery:");
        fields.forEach(f => {
            if (f.toLowerCase().includes('product') || f.toLowerCase().includes('pass')) {
                console.log(`- ${f} (INTERESSANT)`);
            } else {
                console.log(`- ${f}`);
            }
        });
    } else {
        console.log("Erreur lors de l'introspection:", res.errors);
    }
}

main();
