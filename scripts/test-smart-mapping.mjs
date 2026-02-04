import { createCPTService } from '../app/modules/festivals/services/CPTService.js';

async function test() {
    const service = createCPTService();
    console.log("🚀 Fetching Festivals with smart mapping...");
    try {
        const festivals = await service.getAllFestivals();

        festivals.forEach(f => {
            console.log(`\nFestival: ${f.name} (${f.slug})`);
            f.events.forEach(e => {
                console.log(`  - ${e.city}:`);
                console.log(`    Visiteur: ${e.urlBilletterie}`);
                console.log(`    Exposant: ${e.urlExposant}`);
            });
        });
    } catch (e) {
        console.error(e);
    }
}

test();
