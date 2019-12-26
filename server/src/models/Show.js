module.exports = (connection, Sequelize) => connection.define(
  'Show',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    mal_id: {
      type: Sequelize.STRING,
    },
    tvdb_id: {
      type: Sequelize.STRING,
    },
    title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    alt_title: {
      type: Sequelize.STRING,
    },
    english_title: {
      type: Sequelize.STRING,
    },
    seriesName: {
      type: Sequelize.STRING,
    },
    synopsis: {
      type: Sequelize.STRING,
    },
    airsDayOfWeek: {
      type: Sequelize.STRING,
    },
    genre: {
      type: Sequelize.STRING,
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
    tableName: 'show',
  },
);
