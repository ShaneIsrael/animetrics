
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('redditUserScore', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      redditUserId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      mal_show_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      score: {
        type: Sequelize.DOUBLE,
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

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    queryInterface.dropTable('redditUserScore'),

};
