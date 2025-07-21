
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Profile = sequelize.define('Profile', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  userId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'user_id', 
    references: {
      model: 'users',
      key: 'id' 
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  firstName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [2, 100],
        msg: 'Ism 2-100 belgi orasida bo\'lishi kerak'
      },
      notEmpty: {
        msg: 'Ism kiritilishi shart'
      }
    }
  },
  lastName: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      len: {
        args: [2, 100],
        msg: 'Familiya 2-100 belgi orasida bo\'lishi kerak'
      },
      notEmpty: {
        msg: 'Familiya kiritilishi shart'
      }
    }
  },
  address: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [10, 500],
        msg: 'Manzil 10-500 belgi orasida bo\'lishi kerak'
      },
      notEmpty: {
        msg: 'Manzil kiritilishi shart'
      }
    }
  },
  phone: {
    type: DataTypes.STRING(20),
    allowNull: false,
    validate: {
      is: {
        args: /^\+?[1-9]\d{1,14}$/, 
        msg: 'Yaroqli telefon raqam kiriting'
      },
      notEmpty: {
        msg: 'Telefon raqam kiritilishi shart'
      }
    }
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true,
    validate: {
      isUrl: {
        msg: 'Yaroqli URL kiriting'
      }
    }
  },
  bio: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 1000],
        msg: 'Bio 1000 belgidan oshmasligi kerak'
      }
    }
  }
}, {
  tableName: 'profiles',
  indexes: [
    {
      fields: ['user_id']
    },
    {
      fields: ['first_name', 'last_name'] 
    }
  ]
});

Profile.prototype.getFullName = function() {
  return `${this.firstName} ${this.lastName}`;
};

module.exports = Profile;