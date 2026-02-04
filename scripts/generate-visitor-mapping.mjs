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
    console.log("🔍 Recherche des pages visiteur pour TOUS les festivals...\n");

    // Récupérer TOUTES les pages qui contiennent "visiteur" + leur hiérarchie
    const res = await query(`
    query {
      pages(where: {search: "visiteur"}, first: 100) {
        nodes {
          title
          slug
          uri
          ancestors {
            nodes {
              ... on Page {
                title
                slug
              }
            }
          }
        }
      }
    }
    `);

    // Organiser par festival
    const byFestival = {};

    if (res.data?.pages?.nodes) {
        res.data.pages.nodes
            .filter(p => p.slug.startsWith('visiteur-'))
            .forEach(page => {
                // Trouver le festival parent
                const ancestors = page.ancestors?.nodes || [];
                let festival = 'Inconnu';
                let ville = '';

                // Le festival est généralement le dernier ancêtre ou le premier niveau
                for (const anc of ancestors) {
                    if (['japan-otaku-festival', 'japan-manga-wave', 'gamer-connection', 'ink-secret', 'evenement-a-venir'].includes(anc.slug)) {
                        festival = anc.title;
                    }
                }

                // Extraire la ville du slug (visiteur-albi → albi)
                ville = page.slug.replace('visiteur-', '');

                if (!byFestival[festival]) {
                    byFestival[festival] = [];
                }

                byFestival[festival].push({
                    ville,
                    title: page.title,
                    uri: page.uri,
                    fullPath: ancestors.map(a => a.slug).reverse().join(' > ')
                });
            });
    }

    // Afficher le résultat
    console.log("📊 MAPPING FESTIVAL → VILLE → URL VISITEUR\n");
    console.log("=".repeat(80));

    for (const [festival, villes] of Object.entries(byFestival)) {
        console.log(`\n🎪 ${festival}`);
        console.log("-".repeat(60));
        villes.forEach(v => {
            console.log(`  📍 ${v.ville.toUpperCase()}`);
            console.log(`     URL: https://japanconventions.com${v.uri}`);
            console.log(`     Chemin: ${v.fullPath}`);
        });
    }

    // Générer le code TypeScript du mapping
    console.log("\n\n" + "=".repeat(80));
    console.log("💻 CODE TYPESCRIPT POUR LE MAPPING");
    console.log("=".repeat(80));
    console.log("\nconst VISITOR_URL_MAPPING: Record<string, Record<string, string>> = {");

    for (const [festival, villes] of Object.entries(byFestival)) {
        const festivalSlug = festival.toLowerCase()
            .replace(/\s+/g, '-')
            .normalize("NFD").replace(/[\u0300-\u036f]/g, "");
        console.log(`  '${festivalSlug}': {`);
        villes.forEach(v => {
            console.log(`    '${v.ville}': 'https://japanconventions.com${v.uri}',`);
        });
        console.log(`  },`);
    }
    console.log("};");
}

main();
