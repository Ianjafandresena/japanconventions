export interface WordPressResponse<T> {
    data: T;
}

export interface NodeList<T> {
    nodes: T[];
}

export interface Event {
    id: string;
    title: string;
    slug: string;
    content?: string;
    featuredImage?: {
        node: {
            sourceUrl: string;
            altText: string;
        };
    };
    eventDetails?: {
        startDate: string;
        endDate: string;
        location: string;
    };
}

export interface Page {
    id: string;
    title: string;
    content: string;
    slug: string;
}

export interface Post {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    date: string;
}
