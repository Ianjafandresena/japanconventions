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
    console.log("🔍 Vérification des liens Billetterie/Exposant sur les vNements...");
    const res = await query(`
    query {
      vNements(first: 50) {
        nodes {
          title
          slug
          detailsEvenement {
            urlBilletterie
            urlExposant
          }
        }
      }
    }
    `);

    if (res.data?.vNements?.nodes) {
        res.data.vNements.nodes.forEach(v => {
            console.log(`vNement: ${v.title}`);
            console.log(`  - Billetterie: ${v.detailsEvenement?.urlBilletterie || 'VIDE'}`);
            console.log(`  - Exposant: ${v.detailsEvenement?.urlExposant || 'VIDE'}`);
        });
    } else {
        console.log("Erreur:", res.errors);
    }
}

main();
