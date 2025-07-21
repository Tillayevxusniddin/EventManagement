// models/Session.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Session = sequelize.define('Session', {
  sid: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  sess: {
    type: DataTypes.JSON,
    allowNull: false,
  },
  expire: {
    type: DataTypes.DATE(6),
    allowNull: false,
  }
}, {
  tableName: 'user_sessions',
  timestamps: false 
});

module.exports = Session;