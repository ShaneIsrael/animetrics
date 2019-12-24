
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    Promise.all([
      queryInterface.createTable('overrideHistory', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        tokenId: {
          type: Sequelize.INTEGER,
          foreignKey: true,
        },
        table: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        table_id: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        previous_values: {
          type: Sequelize.JSON,
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
      queryInterface.addColumn(
        'week',
        'seasonId',
        {
          type: Sequelize.INTEGER,
          foreignKey: true
        },
      ),
    ]),
  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    Promise.all([
      queryInterface.dropTable('season'),
      queryInterface.removeColumn('week', 'seasonId')
    ])

};
