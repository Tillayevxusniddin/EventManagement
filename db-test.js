// db-test.js
require('dotenv').config();
const { Pool } = require('pg');

console.log('--- Ma\'lumotlar bazasini tekshirish testi boshlandi ---');

const dbConfig = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

console.log('Ulanish uchun ishlatilayotgan ma\'lumotlar:');
console.log('User:', dbConfig.user);
console.log('Host:', dbConfig.host);
console.log('Database:', dbConfig.database);
console.log('Password mavjudmi?:', dbConfig.password ? 'Ha' : 'Yo\'q, topilmadi!');
console.log('Port:', dbConfig.port);
console.log('');

if (!dbConfig.password) {
    console.error('.env faylidan parol o\'qilmadi yoki bo\'sh');
    process.exit(1);
}

const pool = new Pool(dbConfig);

async function testDatabaseConnection() {
  let client;
  try {
    console.log('Ulanishga harakat ...');
    client = await pool.connect();
    console.log('✅ Muvaffaqiyatli!');
    const res = await client.query('SELECT NOW()');
    console.log('Databaseni hozirgi vaqti:', res.rows[0].now);
  } catch (err) {
    console.error('❌ ULANISHDA XATOLIK YUZ BERDI:');
    console.error(err);
  } finally {
    if (client) {
      client.release();
    }
    await pool.end();
    console.log('Ulanish yopildi.');
  }
}

testDatabaseConnection();