module.exports = (connection, Sequelize) => connection.define(
  'Asset',
  {
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
    season: {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 1,
    },
    banner_art: {
      type: Sequelize.STRING,
    },
    poster_art: {
      type: Sequelize.STRING,
    },
    s3_avatar: {
      type: Sequelize.STRING,
    },
    s3_banner: {
      type: Sequelize.STRING,
    },
    s3_poster: {
      type: Sequelize.STRING,
    },
    s3_poster_compressed: {
      type: Sequelize.STRING,
    },
    s3_bucket: {
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
  },
  {
    freezeTableName: true,
    tableName: 'asset',
  },
);
