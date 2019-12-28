module.exports = (connection, Sequelize) => connection.define(
  'Dialog',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alt_type: {
      type: Sequelize.STRING,
    },
    body: {
      type: Sequelize.STRING,
    },
    subject: {
      type: Sequelize.STRING,
    },
    ip: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    read: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
    },
    resolved: {
      type: Sequelize.BOOLEAN,
      defaultValue: false,
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
    tableName: 'dialog',
  },
);
