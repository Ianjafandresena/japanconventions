import { createGraphQLClient } from './app/core/services/GraphQLClient.ts';

const GET_HUB_DATA = `
    query GetHubData {
        festivals(first: 100) {
            nodes {
                slug
                title
            }
        }
    }
`;

async function test() {
    const client = createGraphQLClient();
    const response = await client.query({ festivals: { nodes: [] } }, GET_HUB_DATA);
    console.log('FESTIVAL SLUGS:', response.festivals.nodes.map(n => ({ slug: n.slug, title: n.title })));
}
// Note: This won't run easily as a script because of TS/Nuxt imports.
// I'll use a simpler mjs script like I did before.
