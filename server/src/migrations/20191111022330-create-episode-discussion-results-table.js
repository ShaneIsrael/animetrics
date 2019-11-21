
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    // id, episodeDiscussionId, malSnapshotId, ups, comment_count, mal_snapshot, poll_results
    queryInterface.createTable('episodeDiscussionResult', {
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
    }),

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('episodeDiscussionResult'),

};
