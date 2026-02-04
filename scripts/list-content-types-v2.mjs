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
      contentTypes {
        nodes {
          name
          label
        }
      }
    }
    `);

    if (res.data?.contentTypes?.nodes) {
        res.data.contentTypes.nodes.forEach(ct => {
            console.log(`ContentType: ${ct.label} (${ct.name})`);
        });
    } else {
        console.log("Erreur:", res.errors);
    }
}

main();
