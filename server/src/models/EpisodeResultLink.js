module.exports = (connection, Sequelize) => connection.define(
  'EpisodeResultLink',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    episodeDiscussionId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
    },
    episodeDiscussionResultId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
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
    tableName: 'episodeResultLink',
  },
);
