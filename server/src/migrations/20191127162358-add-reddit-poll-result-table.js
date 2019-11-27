
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('redditPollResult', {
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
    }),

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('redditPollResult'),

};
