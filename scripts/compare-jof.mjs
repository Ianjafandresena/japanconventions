/**
 * Comparaison des données JOF - Site officiel vs GraphQL
 */

const GRAPHQL_URL = 'https://japanconventions.com/graphql';

async function getJOFEvents() {
    const query = `
    query GetJOF {
      page(id: "/japan-otaku-festival/", idType: URI) {
        id
        title
        children(first: 100) {
          nodes {
            ... on Page {
              id
              title
              slug
              uri
            }
          }
        }
      }
    }
  `;

    const res = await fetch(GRAPHQL_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query })
    });

    const data = await res.json();
    return data.data?.page?.children?.nodes || [];
}

async function main() {
    console.log('🔍 ANALYSE DÉTAILLÉE - Japan Otaku Festival\n');
    console.log('═'.repeat(70));

    const allPages = await getJOFEvents();

    console.log(`\n📊 Total des sous-pages GraphQL: ${allPages.length}\n`);
    console.log('─'.repeat(70));
    console.log('TOUTES LES SOUS-PAGES DE /japan-otaku-festival/:');
    console.log('─'.repeat(70));

    allPages.forEach((p, i) => {
        console.log(`${(i + 1).toString().padStart(2)}. ${p.title.padEnd(50)} → ${p.uri}`);
    });

    // Patterns d'exclusion (pages admin)
    const excludePatterns = [
        'dossier', 'exposant', 'visiteur', 'bénévole', 'benevole',
        'date', 'tarif', 'acces', 'accès', 'pass', 'consigne'
    ];

    // Patterns cross-festival (pas JOF)
    const crossFestivalPatterns = [
        'gamer connection', 'ink secret', 'one night', 'japan manga'
    ];

    console.log('\n' + '─'.repeat(70));
    console.log('FILTRAGE:');
    console.log('─'.repeat(70));

    const cities = [];
    const excluded = [];
    const crossFestival = [];

    allPages.forEach(page => {
        const lower = page.title.toLowerCase();
        const slug = page.slug.toLowerCase();

        // Vérifier exclusion admin
        const isAdmin = excludePatterns.some(p => lower.includes(p) || slug.includes(p));
        if (isAdmin) {
            excluded.push({ title: page.title, reason: 'Page admin' });
            return;
        }

        // Vérifier cross-festival
        const isCross = crossFestivalPatterns.some(p => lower.includes(p) || slug.includes(p));
        if (isCross) {
            crossFestival.push({ title: page.title, reason: 'Cross-festival' });
            return;
        }

        // C'est une ville !
        cities.push(page);
    });

    console.log('\n✅ VILLES IDENTIFIÉES (' + cities.length + '):');
    cities.forEach((c, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${c.title}`);
    });

    console.log('\n❌ PAGES ADMIN EXCLUES (' + excluded.length + '):');
    excluded.forEach(e => {
        console.log(`   • ${e.title}`);
    });

    console.log('\n⚠️ CROSS-FESTIVAL EXCLUS (' + crossFestival.length + '):');
    crossFestival.forEach(e => {
        console.log(`   • ${e.title} (${e.reason})`);
    });

    // Comparaison avec le site officiel
    console.log('\n\n' + '═'.repeat(70));
    console.log('📋 COMPARAISON AVEC LE SITE OFFICIEL');
    console.log('═'.repeat(70));

    const officialCities = [
        'Albi',
        'Troyes',
        'Chambéry',
        'La Roche sur Yon',
        'Châlons en Champagne',
        'Marseille',
        'Rouen',
        'Nevers',
        'Niort',
        'Évreux'
    ];

    console.log('\n🌐 VILLES SUR LE SITE OFFICIEL (10):');
    officialCities.forEach((c, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. ${c}`);
    });

    // Trouver les différences
    const graphqlCityNames = cities.map(c => {
        // Extraire le nom de ville du titre
        let name = c.title;
        // Enlever les préfixes communs
        name = name.replace(/^(Palais des sports|Parc Expo|Zenith|Le Cube|La Capitole|Savoi Expo)\s*[-–]\s*/i, '');
        name = name.replace(/\s*[-–]\s*(Palais des sports|Parc Expo|Zenith|Le Cube|La Capitole|Savoi Expo)$/i, '');
        return { original: c.title, cleaned: name.trim() };
    });

    console.log('\n📊 MAPPING GRAPHQL → VILLE:');
    graphqlCityNames.forEach((c, i) => {
        console.log(`   ${(i + 1).toString().padStart(2)}. "${c.original}" → ${c.cleaned}`);
    });

    // Villes dans GraphQL mais pas sur le site officiel
    console.log('\n🔴 VILLES GRAPHQL NON PRÉSENTES SUR LE SITE OFFICIEL:');
    const extraCities = cities.filter(c => {
        const lower = c.title.toLowerCase();
        return !officialCities.some(oc =>
            lower.includes(oc.toLowerCase()) ||
            oc.toLowerCase().includes(lower.split(' ')[0].toLowerCase())
        );
    });

    if (extraCities.length === 0) {
        console.log('   (Aucune)');
    } else {
        extraCities.forEach(c => {
            console.log(`   • ${c.title} (${c.uri})`);
        });
    }

    // Villes sur le site officiel mais pas dans GraphQL
    console.log('\n🟡 VILLES OFFICIELLES NON TROUVÉES DANS GRAPHQL:');
    const missingCities = officialCities.filter(oc => {
        const lower = oc.toLowerCase();
        return !cities.some(c =>
            c.title.toLowerCase().includes(lower) ||
            lower.includes(c.title.toLowerCase().split(' ')[0])
        );
    });

    if (missingCities.length === 0) {
        console.log('   (Aucune)');
    } else {
        missingCities.forEach(c => {
            console.log(`   • ${c}`);
        });
    }

    console.log('\n' + '═'.repeat(70));
    console.log('💡 CONCLUSION');
    console.log('═'.repeat(70));
    console.log(`
Site officiel: 10 villes
GraphQL brut:  ${allPages.length} sous-pages
Après filtre:  ${cities.length} villes

RECOMMANDATIONS:
1. Vérifier les patterns de filtrage dans FestivalService.ts
2. S'assurer que Aubagne/Castres sont bien exclus (Gamer Connection)
3. Vérifier si Nice/Metz/Lisieux sont des pages orphelines
`);
}

main().catch(console.error);
