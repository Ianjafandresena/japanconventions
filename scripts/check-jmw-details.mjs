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
    console.log("🔍 Détails complets du festival JMW...");

    const res = await query(`
    query {
      festival(id: "japan-manga-wave", idType: SLUG) {
        title
        detailsFestival {
          statut
          idLogo
          color
        }
      }
    }
    `);

    console.log(JSON.stringify(res.data.festival, null, 2));
}

main();
