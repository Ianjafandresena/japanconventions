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
    console.log("🔍 Test des champs existants...");

    const res = await query(`
    query {
      festivals(first: 1) {
        nodes {
          title
          detailsFestival {
            idLogo
            color
            statut
          }
        }
      }
      vNements(first: 1) {
        nodes {
          title
          detailsEvenement {
            nomDuLieu
            dateDeDebut
            dateDeFin
            statut
            urlBilletterie
          }
        }
      }
    }
    `);

    console.log("Résultat:", JSON.stringify(res, null, 2));
}

main();
