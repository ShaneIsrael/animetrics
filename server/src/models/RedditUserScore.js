module.exports = (connection, Sequelize) => connection.define(
  'RedditUserScore',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    redditUserId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    mal_show_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    score: {
      type: Sequelize.DOUBLE,
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
    tableName: 'redditUserScore',
  },
);
