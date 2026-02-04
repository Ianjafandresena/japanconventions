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
    console.log("🔍 Exploration de la page Pass VIP Troyes...");
    const res = await query(`
    query {
      page(id: "/japan-otaku-festival/troyes-le-cube/visiteur-troyes/pass-vip-troyes/", idType: URI) {
        title
        content
      }
    }
    `);

    if (res.data?.page) {
        console.log(`PAGE: ${res.data.page.title}`);
        console.log("--- Content ---");
        console.log(res.data.page.content);
    } else {
        console.log("Page non trouvée.");
    }
}

main();
