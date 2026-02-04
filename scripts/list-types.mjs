const GRAPHQL_URL = 'https://japanconventions.com/graphql';

const QUERY = `
    query {
        __schema {
            types {
                name
            }
        }
    }
`;

async function test() {
    const response = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: QUERY })
    });
    const result = await response.json();
    console.log('Result:', JSON.stringify(result, null, 2));
}

test();
