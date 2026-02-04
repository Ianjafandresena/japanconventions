import fetch from 'node-fetch';

const query = `
    query GetPosts($first: Int) {
        posts(first: $first, where: {orderby: [{field: DATE, order: DESC}]}) {
            nodes {
                id
                title
                slug
                date
                excerpt
                uri
                featuredImage {
                    node {
                        sourceUrl
                        altText
                    }
                }
                categories {
                    nodes {
                        name
                        slug
                    }
                }
            }
        }
    }
`;

async function testPress() {
    console.log('Testing Press Query...');
    try {
        const response = await fetch('https://japanconventions.com/graphql', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ query, variables: { first: 5 } })
        });
        const data = await response.json();
        if (data.errors) {
            console.error('GraphQL Errors:', JSON.stringify(data.errors, null, 2));
        } else {
            console.log('Success! Found', data.data.posts.nodes.length, 'articles.');
            console.log('Sample article title:', data.data.posts.nodes[0]?.title);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

testPress();
