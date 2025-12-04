import db from './config/db';

async function checkMascotasStructure() {
    try {
        await db.authenticate();
        console.log('✅ Database connected');

        const [results] = await db.query('DESCRIBE mascotas');
        console.log('\n📋 Mascotas table structure:');
        console.log(results);

        const [data] = await db.query('SELECT * FROM mascotas LIMIT 3');
        console.log('\n🐾 Sample mascotas data:');
        console.log(data);

        await db.close();
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

checkMascotasStructure();
