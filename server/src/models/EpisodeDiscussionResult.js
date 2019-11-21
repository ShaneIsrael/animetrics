module.exports = (connection, Sequelize) => connection.define(
  'EpisodeDiscussionResult',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    episodeDiscussionId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    malSnapshotId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    weekId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    showId: {
      type: Sequelize.INTEGER,
      foreignKey: true,
      allowNull: false,
    },
    ups: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    comment_count: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    poll_results: {
      type: Sequelize.JSON,
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
    tableName: 'episodeDiscussionResult',
  },
);
