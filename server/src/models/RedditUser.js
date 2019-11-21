module.exports = (connection, Sequelize) => connection.define(
  'RedditUser',
  {
    id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    reddit_username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    mal_username: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    lastActiveAt: {
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
  },
  {
    freezeTableName: true,
    tableName: 'redditUser',
  },
);
