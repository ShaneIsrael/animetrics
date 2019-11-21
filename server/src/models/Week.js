module.exports = (connection, Sequelize) => connection.define(
  'Week',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    start_dt: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: true,
    },
    end_dt: {
      type: Sequelize.DATE,
      allowNull: false,
      unique: true,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
    },
  },
  {
    freezeTableName: true,
    tableName: 'week',
  },
);
