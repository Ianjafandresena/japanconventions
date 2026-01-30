// Test du service getFestival avec le slug correct
const url = 'https://japanconventions.com/graphql';

const FESTIVALS_CONFIG = [
  {
    slug: 'japan-otaku-festival',
    name: 'Japan Otaku Festival',
    path: '/japan-otaku-festival/',
    logo: 'https://japanconventions.com/wp-content/uploads/2025/08/Japan-Otaku-festival-Logo-1536x1536-1-3.png',
    color: '#e60012'
  }
];

// Patterns administratifs
const EXCLUDED_PAGE_PATTERNS = [
  'dossier', 'exposant', 'visiteur', 'benevole', 'bénévole', 'association',
  'date', 'horaire', 'acces', 'accès', 'stand', 'pass', 'formulaire',
  'consigne', 'dispositif', 'billetterie', 'pmr', 'vip', 'individuel',
  'familial', 'senior', 'etudiant', 'école', 'ecole', 'cse', 'bde'
];

const CROSS_FESTIVAL_PATTERNS = {
  'japan-otaku-festival': ['ink secret', 'ink-secret', 'gamer connection', 'one night', 'onoe']
};

function isEventCity(title, slug, festivalSlug) {
  const lowerTitle = title.toLowerCase();
  const lowerSlug = slug.toLowerCase();

  for (const pattern of EXCLUDED_PAGE_PATTERNS) {
    if (lowerTitle.includes(pattern) || lowerSlug.includes(pattern)) return false;
  }

  const crossPatterns = CROSS_FESTIVAL_PATTERNS[festivalSlug] || [];
  for (const pattern of crossPatterns) {
    if (lowerTitle.includes(pattern) || lowerSlug.includes(pattern)) return false;
  }

  return true;
}

async function getFestival(slug) {
  console.log(`\n🔍 Getting festival with slug: "${slug}"`);

  const config = FESTIVALS_CONFIG.find(f => f.slug === slug);

  if (!config) {
    console.log(`❌ No config found for slug: "${slug}"`);
    console.log('   Available slugs:', FESTIVALS_CONFIG.map(f => f.slug).join(', '));
    return null;
  }

  console.log(`✅ Config found: ${config.name}`);
  console.log(`   Path: ${config.path}`);

  // Fetch children
  const query = `
        query GetFestival($uri: ID!) {
            page(id: $uri, idType: URI) {
                id title
                children(first: 100) {
                    nodes { ... on Page { id title slug uri } }
                }
            }
        }
    `;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables: { uri: config.path } }),
  });

  const data = await response.json();
  const page = data.data?.page;

  if (!page) {
    console.log('❌ Page not found');
    return null;
  }

  const allChildren = page.children?.nodes || [];
  console.log(`   Total children: ${allChildren.length}`);

  const events = allChildren
    .filter(c => isEventCity(c.title, c.slug, slug))
    .map(c => ({ id: c.id, title: c.title, city: c.title, uri: c.uri }));

  console.log(`   ✅ Events (cities): ${events.length}`);
  events.forEach(e => console.log(`      - ${e.city}`));

  return { ...config, events };
}

async function main() {
  console.log('='.repeat(60));
  console.log('TEST: getFestival avec différents paramètres');
  console.log('='.repeat(60));

  // Test 1: avec le slug correct
  await getFestival('japan-otaku-festival');

  // Test 2: avec le path (ce qui se passait avant)
  await getFestival('/japan-otaku-festival');

  // Test 3: avec le path et trailing slash
  await getFestival('/japan-otaku-festival/');
}

main();
