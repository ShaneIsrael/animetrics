module.exports = (connection, Sequelize) => connection.define(
  'EpisodeResultLink',
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
      unique: true
    },
    episodeDiscussionResultId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      unique: true
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
