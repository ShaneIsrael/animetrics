
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    // id, showId, weekId, score, scored_by, rank, episodes, favorites, popularity, members
    queryInterface.createTable('malSnapshot', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      showId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      weekId: {
        type: Sequelize.INTEGER,
        foreignKey: true,
        allowNull: false,
      },
      score: {
        type: Sequelize.DOUBLE,
        allowNull: false,
      },
      scored_by: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      rank: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      episodes: {
        type: Sequelize.INTEGER,
      },
      favorites: {
        type: Sequelize.INTEGER,
      },
      popularity: {
        type: Sequelize.INTEGER,
      },
      members: {
        type: Sequelize.INTEGER,
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
    queryInterface.dropTable('malSnapshot'),

};
