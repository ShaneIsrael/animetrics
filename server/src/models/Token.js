const uuid = require('uuid/v4')

module.exports = (connection, Sequelize) => connection.define(
  'Token',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    token: {
      type: Sequelize.UUID,
      allowNull: false,
      defaultValue: uuid(),
    },
    name: {
      type: Sequelize.STRING,
    },
    level: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    active: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
    createdAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
    updatedAt: {
      allowNull: false,
      type: Sequelize.DATE,
    },
  },
  {
    freezeTableName: true,
    tableName: 'token',
  },
)
