const GRAPHQL_URL = 'https://japanconventions.com/graphql';

async function query(gql) {
    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: gql })
    });
    return await res.json();
}

async function main() {
    console.log("🔍 ANALYSE APPROFONDIE - Structure Festival → Ville → Pages\n");
    console.log("=".repeat(80));

    const festivals = [
        { name: 'Japan Otaku Festival', slug: 'japan-otaku-festival' },
        { name: 'Japan Manga Wave', slug: 'japan-manga-wave' },
        { name: 'Gamer Connection', slug: 'gamer-connection' },
        { name: 'Ink Secret', slug: 'ink-secret' },
        { name: 'One Night Event', slug: 'evenement-a-venir' }
    ];

    for (const festival of festivals) {
        console.log(`\n\n🎪 FESTIVAL: ${festival.name}`);
        console.log("-".repeat(60));

        // Récupérer les pages enfants de ce festival
        const res = await query(`
        query {
          page(id: "/${festival.slug}/", idType: URI) {
            title
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
        `);

        if (res.data?.page?.children?.nodes) {
            const cities = res.data.page.children.nodes;

            for (const city of cities) {
                // Identifier si c'est une ville (pas une page admin)
                const isAdminPage = ['dossier', 'exposant', 'date', 'horaire', 'consigne', 'dispositif', 'objet', 'acces', 'pmr']
                    .some(k => city.slug.toLowerCase().includes(k));

                if (!isAdminPage && city.children?.nodes?.length > 0) {
                    console.log(`\n  📍 VILLE: ${city.title}`);
                    console.log(`     Slug: ${city.slug}`);
                    console.log(`     URI: ${city.uri}`);

                    // Chercher les pages visiteur/exposant
                    const subPages = city.children.nodes;
                    const visiteurPage = subPages.find(p => p.slug.includes('visiteur'));
                    const exposantPage = subPages.find(p => p.slug.includes('exposant') || p.slug.includes('dossier'));

                    if (visiteurPage) {
                        console.log(`     ✅ Visiteur: ${visiteurPage.uri}`);
                    }
                    if (exposantPage) {
                        console.log(`     ✅ Exposant: ${exposantPage.uri}`);
                    }
                    if (!visiteurPage && !exposantPage) {
                        console.log(`     ⚠️  Pas de page visiteur/exposant trouvée`);
                        console.log(`        Sous-pages: ${subPages.map(p => p.slug).join(', ')}`);
                    }
                }
            }

            // Chercher aussi les pages visiteur au niveau du festival (cas spécial comme Albi)
            const directVisiteur = cities.filter(c => c.slug.includes('visiteur'));
            if (directVisiteur.length > 0) {
                console.log(`\n  📍 PAGES VISITEUR DIRECTES (niveau festival):`);
                directVisiteur.forEach(v => {
                    console.log(`     - ${v.title}: ${v.uri}`);
                });
            }
        } else {
            console.log(`  ❌ Page festival non trouvée ou pas d'enfants`);
            if (res.errors) {
                console.log(`     Erreur: ${res.errors[0]?.message}`);
            }
        }
    }

    console.log("\n\n" + "=".repeat(80));
    console.log("📊 RÉSUMÉ - Mapping Festival + Ville → URLs");
    console.log("=".repeat(80));
}

main();
