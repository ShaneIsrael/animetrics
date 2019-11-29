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
        's3_avatar',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'asset',
        's3_poster',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'asset',
        's3_banner',
        {
          type: Sequelize.STRING,
        },
      ),
      queryInterface.addColumn(
        'asset',
        's3_bucket',
        {
          type: Sequelize.STRING,
        },
      ),
    ])
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn('asset', 's3_avatar'),
      queryInterface.removeColumn('asset', 's3_poster'),
      queryInterface.removeColumn('asset', 's3_banner'),
      queryInterface.removeColumn('asset', 's3_bucket'),
    ])
  }
};
