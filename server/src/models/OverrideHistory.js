module.exports = (connection, Sequelize) => connection.define(
  'OverrideHistory',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    tokenId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
    },
    table: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    table_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    previous_values: {
      type: Sequelize.JSON,
      allowNull: false,
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
    tableName: 'overrideHistory',
  },
)
