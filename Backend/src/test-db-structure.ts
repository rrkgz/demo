import db from './config/db';

async function testDatabaseStructure() {
    try {
        await db.authenticate();
        console.log('✅ Database connected');

        // Query veterinarios table structure
        const [results] = await db.query('DESCRIBE veterinarios');
        console.log('\n📋 Veterinarios table structure:');
        console.log(results);

        // Query existing veterinarios data
        const [vets] = await db.query('SELECT * FROM veterinarios LIMIT 5');
        console.log('\n👨‍⚕️ Sample veterinarios data:');
        console.log(vets);

        await db.close();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

testDatabaseStructure();
