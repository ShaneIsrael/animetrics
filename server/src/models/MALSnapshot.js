module.exports = (connection, Sequelize) => connection.define(
  'MALSnapshot',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    weekId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    score: {
      type: Sequelize.DOUBLE,
      allowNull: false,
    },
    scored_by: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    rank: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    episodes: {
      type: Sequelize.INTEGER,
    },
    favorites: {
      type: Sequelize.INTEGER,
    },
    popularity: {
      type: Sequelize.INTEGER,
    },
    members: {
      type: Sequelize.INTEGER,
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
    tableName: 'malSnapshot',
  },
);
