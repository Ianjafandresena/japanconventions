// Script pour vérifier les données CPT
const GRAPHQL_URL = 'https://japanconventions.com/graphql';

async function checkData() {
    const query = `
        query {
            festivals {
                nodes {
                    databaseId
                    title
                    slug
                    detailsFestival {
                        idLogo
                        statut
                    }
                }
            }
            vNements {
                nodes {
                    databaseId
                    title
                    slug
                }
            }
        }
    `;

    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    const data = await response.json();

    console.log('=== FESTIVALS ===');
    console.log(JSON.stringify(data.data.festivals.nodes, null, 2));

    console.log('\n=== ÉVÉNEMENTS ===');
    console.log(JSON.stringify(data.data.vNements.nodes, null, 2));
    console.log(`\nTotal événements: ${data.data.vNements.nodes.length}`);
}

checkData().catch(console.error);
