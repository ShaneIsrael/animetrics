
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   Promise.all([
     queryInterface.createTable('season', {
       id: {
         type: Sequelize.INTEGER,
         primaryKey: true,
         autoIncrement: true,
       },
       season: {
         type: Sequelize.STRING,
         allowNull: false,
       },
       year: {
         type: Sequelize.INTEGER,
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
        foreignKey: true,
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
