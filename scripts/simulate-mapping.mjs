const GRAPHQL_URL = 'https://japanconventions.com/graphql';

async function query(gql) {
    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gql })
    });
    return await res.json();
}

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
                    urlExposant
                    urlBilletterie
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
                    urlExposant
                    festival {
                        nodes {
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

const GET_PAGES_HIERARCHY = `
query GetPagesHierarchy {
  pages(where: { parent: 0 }, first: 100) {
    nodes {
      title
      slug
      uri
      children(first: 100) {
        nodes {
          ... on Page {
            title
            slug
            uri
            children(first: 50) {
              nodes {
                ... on Page {
                  title
                  slug
                  uri
                }
              }
            }
          }
        }
      }
    }
  }
}
`;

async function main() {
    console.log("🚀 Testing Smart Mapping logic...");
    const [hubRes, pagesRes] = await Promise.all([
        query(GET_HUB_DATA),
        query(GET_PAGES_HIERARCHY)
    ]);

    const festivals = hubRes.data.festivals.nodes;
    const evenements = hubRes.data.vNements.nodes;
    const pages = pagesRes.data.pages.nodes;

    festivals.filter(f => f.detailsFestival?.statut?.[0] === 'active').forEach(festival => {
        console.log(`\nFestival: ${festival.title} (${festival.slug})`);

        const festivalPage = pages.find(p => p.slug === festival.slug);
        const cityPages = festivalPage?.children?.nodes || [];

        const festivalEvents = evenements.filter(e => {
            const eventFestivalId = e.detailsEvenement?.festival?.nodes?.[0]?.databaseId;
            if (eventFestivalId) return eventFestivalId === festival.databaseId;
            const festSlugPart = festival.slug.replace('japan-', '').replace('-festival', '');
            return e.slug.toLowerCase().includes(festSlugPart);
        });

        festivalEvents.forEach(e => {
            const citySlug = e.villes?.nodes?.[0]?.slug;
            let cityPage = cityPages.find((p) => p.slug.includes(citySlug) || e.title.includes(p.title));
            if (!cityPage) {
                cityPage = pages.find((p) => p.uri.includes(`/${festival.slug}/${citySlug}/`));
            }

            const subPages = cityPage?.children?.nodes || [];
            const searchContext = subPages.length > 0 ? subPages : cityPages;

            const visitorPage = searchContext.find((p) =>
                p.slug.toLowerCase().includes('visiteur') && (p.slug.includes(citySlug) || cityPage?.slug === p.slug)
            );

            const exhibitorPage = searchContext.find((p) =>
                p.slug.toLowerCase().includes('exposant') && (p.slug.includes(citySlug) || cityPage?.slug === p.slug)
            );

            console.log(`  - ${e.title}:`);
            console.log(`    Visiteur: ${visitorPage?.uri ? 'https://japanconventions.com' + visitorPage.uri : '---'}`);
            console.log(`    Exposant: ${exhibitorPage?.uri ? 'https://japanconventions.com' + exhibitorPage.uri : '---'}`);
        });
    });
}

main();
