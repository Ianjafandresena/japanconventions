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
    console.log("🔍 Exploration des champs Festivals et Événements...");

    // On teste une petite requête sur un festival pour voir ce que DetailsFestival contient
    const res = await query(`
    query {
      festivals(first: 1) {
        nodes {
          title
          detailsFestival {
            __typename
          }
        }
      }
      vNements(first: 1) {
        nodes {
          title
          detailsEvenement {
            __typename
          }
        }
      }
    }
    `);

    console.log("Résultat:", JSON.stringify(res, null, 2));
}

main();
