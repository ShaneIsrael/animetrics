'use strict';

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */

    return Promise.all([
      queryInterface.addColumn(
        'show',
        'seriesName',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'show',
        'synopsis',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'show',
        'airsDayOfWeek',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'show',
        'genre',
        {
          type: Sequelize.STRING,
        },
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('show', 'seriesName'),
      queryInterface.removeColumn('show', 'synopsis'),
      queryInterface.removeColumn('show', 'airsDayOfWeek'),
      queryInterface.removeColumn('show', 'genre'),
    ])
  }
};
