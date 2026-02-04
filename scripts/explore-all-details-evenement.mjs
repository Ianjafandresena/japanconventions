// Script pour explorer TOUS les champs de DetailsEvenement
const GRAPHQL_URL = 'https://japanconventions.com/graphql';

const QUERY = `
    query {
        __type(name: "DetailsEvenement") {
            fields {
                name
                description
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
        console.log("=== Champs de DetailsEvenement ===");
        result.data.__type.fields.forEach(field => {
            console.log(`- ${field.name}`);
        });
    } catch (e) {
        console.error(e);
    }
}

explore();
