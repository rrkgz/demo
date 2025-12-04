const mysql = require('mysql2/promise');

(async () => {
  const conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'demoV'
  });

  try {
    console.log('=== VERIFICACIÓN DE DATOS ===\n');

    // Verificar mascotas de Tobias
    const [mascotas] = await conn.execute('SELECT * FROM mascotas WHERE rut_cliente = 3');
    console.log('Mascotas de Tobias (rut_cliente=3):');
    console.log(JSON.stringify(mascotas, null, 2));

    // Verificar reservas de Tobias
    const [reservas] = await conn.execute('SELECT * FROM reservas WHERE rut_cliente = "219632746"');
    console.log('\nReservas de Tobias (RUT=219632746):');
    console.log(JSON.stringify(reservas, null, 2));

    // Verificar relaciones completas
    const [full] = await conn.execute(`
      SELECT 
        r.id_reserva, 
        r.rut_cliente,
        r.id_mascota,
        r.fecha,
        r.hora,
        m.nombre as mascota_nombre,
        v.nombre as veterinario_nombre,
        s.nombre as servicio_nombre
      FROM reservas r
      LEFT JOIN mascotas m ON r.id_mascota = m.id_mascota
      LEFT JOIN veterinarios v ON r.id_veterinario = v.email
      LEFT JOIN servicios s ON r.id_servicio = s.id_servicio
      WHERE r.rut_cliente = '219632746'
    `);

    console.log('\nReservas con relaciones completas:');
    full.forEach(r => {
      console.log(`ID: ${r.id_reserva} | ${r.mascota_nombre} | ${r.fecha} ${r.hora}`);
    });

  } catch(e) {
    console.error('Error:', e.message);
  }

  await conn.end();
})();
