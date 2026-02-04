// Script pour tester la requête optimisée avec nodes pour le festival
const GRAPHQL_URL = 'https://japanconventions.com/graphql';

const GET_HUB_DATA_V2 = `
    query GetHubData {
        festivals(first: 100) {
            nodes {
                databaseId
                title
                slug
                detailsFestival {
                    idLogo
                    color
                    statut
                }
            }
        }
        vNements(first: 100) {
            nodes {
                databaseId
                title
                slug
                detailsEvenement {
                    nomDuLieu
                    dateDeDebut
                    dateDeFin
                    statut
                    urlBilletterie
                    festival {
                        nodes {
                            ... on Festival {
                                databaseId
                            }
                        }
                    }
                }
                villes {
                    nodes {
                        name
                        slug
                    }
                }
            }
        }
    }
`;

async function test() {
    console.log('Testing GET_HUB_DATA V2...');
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_HUB_DATA_V2 })
        });

        const result = await response.json();
        if (result.errors) {
            console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
        } else {
            console.log('Success! Data received.');
            console.log('Festivals count:', result.data.festivals.nodes.length);
            console.log('Evenements count:', result.data.vNements.nodes.length);
            console.log('Sample evenement festival info:', JSON.stringify(result.data.vNements.nodes[0].detailsEvenement.festival, null, 2));
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

test();
