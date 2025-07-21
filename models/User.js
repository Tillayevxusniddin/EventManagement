// models/User.js
// Foydalanuvchi modeli
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcrypt');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: {
      msg: 'Bu foydalanuvchi nomi allaqachon band'
    },
    validate: {
      len: {
        args: [3, 50],
        msg: 'Foydalanuvchi nomi 3-50 belgi orasida bo\'lishi kerak'
      },
      is: {
        args: /^[a-zA-Z0-9_]+$/,
        msg: 'Foydalanuvchi nomi faqat harf, raqam va _ belgi bo\'lishi mumkin'
      }
    }
  },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: {
      msg: 'Bu email allaqachon ro\'yxatdan o\'tgan'
    },
    validate: {
      isEmail: {
        msg: 'Yaroqli email kiriting'
      }
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: {
      len: {
        args: [6],
        msg: 'Parol kamida 6 belgidan iborat bo\'lishi kerak'
      }
    }
  },
  role: {
    type: DataTypes.ENUM('attendee', 'organizer', 'admin'),
    defaultValue: 'attendee',
    allowNull: false,
    validate: {
      isIn: {
        args: [['attendee', 'organizer', 'admin']],
        msg: 'Yaroqli rol tanlang'
      }
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'users',
  indexes: [
    {
      unique: true,
      fields: ['username']
    },
    {
      unique: true,
      fields: ['email']
    },
    {
      fields: ['role']
    }
  ],
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const saltRounds = 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        const saltRounds = 12;
        user.password = await bcrypt.hash(user.password, saltRounds);
      }
    }
  }
});

User.prototype.checkPassword = async function(password) {
  return await bcrypt.compare(password, this.password);
};

User.prototype.isOrganizer = function() {
  return this.role === 'organizer' || this.role === 'admin';
};

User.prototype.isAdmin = function() {
  return this.role === 'admin';
};

User.prototype.toSafeObject = function() {
  const { password, ...safeUser } = this.toJSON();
  return safeUser;
};

module.exports = User;