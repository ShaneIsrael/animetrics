module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('show', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      mal_id: {
        type: Sequelize.STRING,
      },
      tvdb_id: {
        type: Sequelize.STRING,
      },
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      alt_title: {
        type: Sequelize.STRING,
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

  down: (queryInterface) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('show'),

};
