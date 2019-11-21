
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    queryInterface.createTable('episodeResultLink', {
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
        unique: true
      },
      episodeDiscussionResultId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        unique: true
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
    queryInterface.dropTable('episodeResultLink'),

};
