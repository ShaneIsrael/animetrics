
module.exports = {
  up: (queryInterface, Sequelize) =>
  /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    Promise.all([
      queryInterface.addColumn(
        'episodeDiscussionResult',
        'ralScore',
        {
          type: Sequelize.STRING,
        },
      ),
    ]),
  down: (queryInterface, Sequelize) => Promise.all([
    queryInterface.removeColumn('episodeDiscussionResult', 'ralScore'),
  ]),
};
