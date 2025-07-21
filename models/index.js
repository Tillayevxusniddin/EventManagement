// models/index.js

const { sequelize } = require('../config/database');
const User = require('./User');
const Profile = require('./Profile');
const Event = require('./Event');
const Registration = require('./Registration');
const Comment = require('./Comment');
const Session = require('./Session');

const initAssociations = () => {
  User.hasOne(Profile, {
    foreignKey: 'userId',
    as: 'profile',
    onDelete: 'CASCADE'
  });
  Profile.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  User.hasMany(Event, {
    foreignKey: 'organizerId',
    as: 'organizedEvents', 
    onDelete: 'CASCADE'
  });
  Event.belongsTo(User, {
    foreignKey: 'organizerId',
    as: 'organizer'
  });

  User.belongsToMany(Event, {
    through: Registration, 
    foreignKey: 'userId',
    otherKey: 'eventId',
    as: 'registeredEvents'
  });
  Event.belongsToMany(User, {
    through: Registration,
    foreignKey: 'eventId',
    otherKey: 'userId',
    as: 'attendees' 
  });

  User.hasMany(Registration, {
    foreignKey: 'userId',
    as: 'registrations'
  });
  Registration.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });

  Event.hasMany(Registration, {
    foreignKey: 'eventId',
    as: 'registrations'
  });
  Registration.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
  });

  User.hasMany(Comment, {
    foreignKey: 'userId',
    as: 'comments'
  });
  Comment.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
  });
    
  Event.hasMany(Comment, {
    foreignKey: 'eventId',
    as: 'comments'
  });
  Comment.belongsTo(Event, {
    foreignKey: 'eventId',
    as: 'event'
  });

  console.log('✅ Model bog\'lanishlari muvaffaqiyatli o\'rnatildi');
};

const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force, alter: !force });
    console.log('✅ Ma\'lumotlar bazasi muvaffaqiyatli sinxronlashtirildi');
  } catch (error) {
    console.error('❌ Ma\'lumotlar bazasini sinxronlashtirishda xatolik:', error);
    throw error; 
  }
};

module.exports = {
  sequelize,
  User,
  Profile,
  Event,
  Registration,
  Comment,
  Session,
  initAssociations,
  syncDatabase
};