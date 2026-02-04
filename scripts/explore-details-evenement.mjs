// Script pour explorer le schéma GraphQL du champ festival dans detailsEvenement
const GRAPHQL_URL = 'https://japanconventions.com/graphql';

const QUERY = `
    query {
        __type(name: "DetailsEvenement") {
            fields {
                name
                type {
                    name
                    kind
                    ofType {
                        name
                        kind
                    }
                }
            }
        }
    }
`;

async function explore() {
    try {
        const response = await fetch(GRAPHQL_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query: QUERY })
        });
        const result = await response.json();
        console.log(JSON.stringify(result.data.__type.fields.find(f => f.name === 'festival'), null, 2));
    } catch (e) {
        console.error(e);
    }
}

explore();
