module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.removeColumn('episodeDiscussionResult', 'poll_results'),
  down: (queryInterface, Sequelize) => queryInterface.addColumn(
    'episodeDiscussionResult',
    'poll_results',
    {
      type: Sequelize.JSON,
    },
  ),
};
