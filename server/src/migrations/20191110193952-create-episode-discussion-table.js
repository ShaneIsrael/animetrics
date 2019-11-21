
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('episodeDiscussion', {
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
      post_title: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      post_poll_url: {
        type: Sequelize.STRING,
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
    }),
  // id, showId, weekId, post_id, season, episode, post_title, post_url, post_created_dt

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('episode_discussion'),

};
