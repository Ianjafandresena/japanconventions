import type { WordPressResponse, NodeList, Event, Post, Page } from '../types/wordpress';

export class WordPressService {
    private baseUrl: string;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private async query<T>(query: string, variables?: any): Promise<T> {
        const { data, error } = await useFetch<WordPressResponse<T>>(this.baseUrl, {
            method: 'POST',
            body: {
                query,
                variables
            }
        });

        if (error.value) {
            throw new Error(`GraphQL Error: ${error.value.message}`);
        }

        if (!data.value?.data) {
            throw new Error('No data returned from WordPress');
        }

        return data.value.data;
    }

    async getEvents(first: number = 10): Promise<Event[]> {
        const GQL_QUERY = `
      query GetEvents($first: Int) {
        events(first: $first) {
          nodes {
            id
            title
            slug
            featuredImage {
              node {
                sourceUrl
                altText
              }
            }
          }
        }
      }
    `;

        const response = await this.query<{ events: NodeList<Event> }>(GQL_QUERY, { first });
        return response.events.nodes;
    }

    async getPageBySlug(slug: string): Promise<Page> {
        const GQL_QUERY = `
      query GetPageBySlug($slug: ID!) {
        page(id: $slug, idType: URI) {
          id
          title
          content
          slug
        }
      }
    `;

        const response = await this.query<{ page: Page }>(GQL_QUERY, { slug });
        return response.page;
    }

    async getPosts(first: number = 10): Promise<Post[]> {
        const GQL_QUERY = `
      query GetPosts($first: Int) {
        posts(first: $first) {
          nodes {
            id
            title
            slug
            excerpt
            date
          }
        }
      }
    `;

        const response = await this.query<{ posts: NodeList<Post> }>(GQL_QUERY, { first });
        return response.posts.nodes;
    }
}
