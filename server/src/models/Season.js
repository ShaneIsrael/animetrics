module.exports = (connection, Sequelize) => connection.define(
  'Season',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    season: {
      type: Sequelize.STRING,
      allowNull: false
    },
    year: {
      type: Sequelize.INTEGER,
      allowNull: false
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
    tableName: 'season',
  },
);
