module.exports = (connection, Sequelize) => connection.define(
  'EpisodeDiscussion', {
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
    post_id: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    season: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    episode: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    post_poll_url: {
      type: Sequelize.STRING,
    },
    post_title: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    post_url: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    post_created_dt: {
      type: Sequelize.DATE,
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
  }, {
    freezeTableName: true,
    tableName: 'episodeDiscussion',
  },
);
