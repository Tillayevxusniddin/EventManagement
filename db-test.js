// db-test.js
require('dotenv').config();
const { Pool } = require('pg');

console.log('--- Ma\'lumotlar bazasini tekshirish skripti ---');
console.log('Maqsad: .env faylidagi ma\'lumotlar bilan to\'g\'ridan-to\'g\'ri ulanishni tekshirish.');
console.log('');

const dbConfig = {
  user: process.env.DB_USERNAME,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
};

console.log('Ulanish uchun ishlatilayotgan sozlamalar:');
console.log('User:', dbConfig.user);
console.log('Host:', dbConfig.host);
console.log('Database:', dbConfig.database);
console.log('Password mavjudmi?:', dbConfig.password ? 'Ha' : 'Yo\'q, topilmadi!');
console.log('Port:', dbConfig.port);
console.log('');

if (!dbConfig.password) {
    console.error('DIQQAT! .env faylidan parol o\'qilmadi yoki bo\'sh. Iltimos, DB_PASSWORD o\'zgaruvchisini tekshiring.');
    process.exit(1);
}

const pool = new Pool(dbConfig);

async function testDatabaseConnection() {
  let client;
  try {
    console.log('Ulanishga harakat qilinmoqda...');
    client = await pool.connect();
    console.log('✅ Ma\'lumotlar bazasiga to\'g\'ridan-to\'g\'ri ulanish muvaffaqiyatli!');
    const res = await client.query('SELECT NOW()');
    console.log('Ma\'lumotlar bazasining hozirgi vaqti:', res.rows[0].now);
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