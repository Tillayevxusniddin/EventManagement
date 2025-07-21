const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const Comment = sequelize.define('Comment', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true
  },
  eventId: {
    type: DataTypes.UUID,
    allowNull: false,
    field: 'event_id',
    references: {
      model: 'events',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
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
  content: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      len: {
        args: [1, 2000],
        msg: 'Izoh 1-2000 belgi orasida bo\'lishi kerak'
      },
      notEmpty: {
        msg: 'Izoh mazmuni bo\'sh bo\'lishi mumkin emas'
      }
    }
  },
  parentId: {
    type: DataTypes.UUID,
    allowNull: true,
    field: 'parent_id',
    references: {
      model: 'comments',
      key: 'id'
    },
    onUpdate: 'CASCADE',
    onDelete: 'CASCADE'
  }
}, {
  tableName: 'comments',
  indexes: [
    { fields: ['event_id'] },
    { fields: ['user_id'] },
    { fields: ['parent_id'] },
    { fields: ['created_at'] }
  ]
});

Comment.hasMany(Comment, {
  as: 'replies',
  foreignKey: 'parentId',
  onDelete: 'CASCADE'
});

Comment.belongsTo(Comment, {
  as: 'parent',
  foreignKey: 'parentId'
});

Comment.prototype.isReply = function() {
  return this.parentId !== null;
};

module.exports = Comment;