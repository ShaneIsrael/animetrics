
module.exports = {
  up: (queryInterface, Sequelize) =>
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    Promise.all([
      queryInterface.createTable('dialog', {
        id: {
          type: Sequelize.INTEGER,
          primaryKey: true,
          autoIncrement: true,
        },
        type: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        alt_type: {
          type: Sequelize.STRING,
        },
        body: {
          type: Sequelize.STRING,
        },
        subject: {
          type: Sequelize.STRING,
        },
        ip: {
          type: Sequelize.STRING,
          allowNull: false,
        },
        read: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
        },
        resolved: {
          type: Sequelize.BOOLEAN,
          defaultValue: false,
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
    ]),

  down: (queryInterface, Sequelize) =>
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    Promise.all([
      queryInterface.dropTable('dialog'),
    ]),

};
