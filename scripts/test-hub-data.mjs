// Script pour tester la requête optimisée GET_HUB_DATA
const GRAPHQL_URL = 'https://japanconventions.com/graphql';

const GET_HUB_DATA = `
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
                        ... on Festival {
                            databaseId
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
    console.log('Testing GET_HUB_DATA...');
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: GET_HUB_DATA })
        });

        const result = await response.json();
        if (result.errors) {
            console.error('GraphQL Errors:', JSON.stringify(result.errors, null, 2));
        } else {
            console.log('Success! Data received.');
            console.log('Festivals count:', result.data.festivals.nodes.length);
            console.log('Evenements count:', result.data.vNements.nodes.length);
        }
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

test();
