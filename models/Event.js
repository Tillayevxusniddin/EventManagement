// models/Event.js
// Tadbir modeli
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Event = sequelize.define('Event', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  name: {
    type: DataTypes.STRING(200),
    allowNull: false,
    validate: {
      len: {
        args: [5, 200],
        msg: 'Tadbir nomi 5-200 belgi orasida bo\'lishi kerak'
      },
      notEmpty: {
        msg: 'Tadbir nomi kiritilishi shart'
      }
    }
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
    validate: {
      len: {
        args: [0, 5000],
        msg: 'Tavsif 5000 belgidan oshmasligi kerak'
      }
    }
  },
  date: {
    type: DataTypes.DATE,
    allowNull: false,
    validate: {
      isDate: {
        msg: 'Yaroqli sana kiriting'
      },
      isFuture(value) {
        if (new Date(value) <= new Date()) {
          throw new Error('Tadbir sanasi kelajakda bo\'lishi kerak');
        }
      }
    }
  },
  location: {
    type: DataTypes.STRING(500),
    allowNull: false,
    validate: {
      len: {
        args: [5, 500],
        msg: 'Joylashuv 5-500 belgi orasida bo\'lishi kerak'
      },
      notEmpty: {
        msg: 'Joylashuv kiritilishi shart'
      }
    }
  },
  organizerId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'organizer_id',
    references: {
      model: 'users',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  },
  maxAttendees: {
    type: DataTypes.INTEGER,
    allowNull: true,
    defaultValue: null,
    validate: {
      min: {
        args: [1],
        msg: 'Ishtirokchilar soni kamida 1 bo\'lishi kerak'
      }
    }
  },
  price: {
    type: DataTypes.DECIMAL(10, 2),
    allowNull: true,
    defaultValue: 0.00,
    validate: {
      min: {
        args: [0],
        msg: 'Narx manfiy bo\'lishi mumkin emas'
      }
    }
  },
  status: {
    type: DataTypes.ENUM('draft', 'published', 'cancelled', 'completed'),
    defaultValue: 'published',
    allowNull: false
  },
  imageUrl: {
    type: DataTypes.STRING(500),
    allowNull: true,
  }
}, {
  tableName: 'events',
  indexes: [
    { fields: ['organizer_id'] },
    { fields: ['date'] },
    { fields: ['status'] },
    { fields: ['name'] }
  ]
});

Event.prototype.isUpcoming = function() {
  return new Date(this.date) > new Date();
};

Event.prototype.isPast = function() {
  return new Date(this.date) < new Date();
};

Event.prototype.getFormattedDate = function() {
  return new Date(this.date).toLocaleDateString('uz-UZ', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

module.exports = Event;