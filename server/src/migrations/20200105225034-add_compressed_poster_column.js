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
        'asset',
        's3_poster_compressed',
        {
          type: Sequelize.STRING,
        },
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('asset', 's3_poster_compressed'),
    ])
  }
}
