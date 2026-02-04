// Script pour tester le CPTService localement
import { createCPTService } from '../app/modules/festivals/services/CPTService.ts';

async function test() {
    const service = createCPTService();

    console.log('=== Test getAllFestivals ===');
    const festivals = await service.getAllFestivals();

    festivals.forEach(f => {
        console.log(`${f.name} (${f.slug}): ${f.events.length} événements`);
    });
}

test().catch(console.error);
