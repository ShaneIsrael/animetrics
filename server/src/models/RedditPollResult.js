module.exports = (connection, Sequelize) => connection.define(
  'RedditPollResult',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    showId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
    },
    weekId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
    },
    episodeDiscussionId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
    },
    score: {
      type: Sequelize.DOUBLE,
    },
    votes: {
      type: Sequelize.INTEGER,
    },
    poll: {
      type: Sequelize.JSON,

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
    tableName: 'redditPollResult',
  },
);
