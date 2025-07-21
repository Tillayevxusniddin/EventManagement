// config/database.js

const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'event_management',
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'xusniddin2004',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  dialect: 'postgres',
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000
  },
  define: {
    underscored: true, 
    timestamps: true,
    freezeTableName: true 
  }
});

const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ Ma\'lumotlar bazasiga muvaffaqiyatli ulanildi');
  } catch (error) {
    console.error('❌ Ma\'lumotlar bazasiga ulanishda xatolik:', error);
  }
};

module.exports = { sequelize, testConnection };