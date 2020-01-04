const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');

const basename = path.basename(__filename);
const { environment } = require('../config')

const config = require(`${__dirname}/../config/config.json`)[environment];
const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs
  .readdirSync(__dirname)
  .filter((file) => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
  .forEach((file) => {
    const model = sequelize.import(path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach((modelName) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;
db.Op = Sequelize.Op

db.Show.hasMany(db.EpisodeDiscussion)
db.EpisodeDiscussion.belongsTo(db.Show)

db.Show.hasMany(db.EpisodeDiscussionResult)
db.EpisodeDiscussionResult.belongsTo(db.Show)

db.Show.hasMany(db.MALSnapshot)
db.MALSnapshot.belongsTo(db.Show)

db.Show.hasMany(db.Asset)
db.Asset.belongsTo(db.Show)

db.Show.hasMany(db.RedditUserScore, {
  foreignKey: 'mal_show_id',
  targetKey: 'mal_id',
})
db.RedditUserScore.belongsTo(db.Show, {
  foreignKey: 'mal_show_id',
  targetKey: 'mal_id',
})
db.RedditUserScore.belongsTo(db.RedditUser)

db.Week.hasMany(db.EpisodeDiscussion)
db.EpisodeDiscussion.belongsTo(db.Week)

db.Week.hasMany(db.MALSnapshot)
db.MALSnapshot.belongsTo(db.Week)

db.Week.hasMany(db.EpisodeDiscussionResult)
db.EpisodeDiscussionResult.belongsTo(db.Week)

db.EpisodeDiscussionResult.belongsTo(db.MALSnapshot)
// db.MALSnapshot.belongsTo(db.EpisodeDiscussionResult)
db.EpisodeDiscussionResult.hasOne(db.EpisodeDiscussion, {
  foreignKey: 'id',
  targetKey: 'episodeDiscussionId',
})
db.EpisodeDiscussion.hasOne(db.EpisodeDiscussionResult)

db.Show.hasMany(db.EpisodeResultLink)
db.Week.hasMany(db.EpisodeResultLink)
db.EpisodeResultLink.belongsTo(db.Show)
db.EpisodeResultLink.belongsTo(db.Week)
db.EpisodeResultLink.belongsTo(db.EpisodeDiscussion)
db.EpisodeResultLink.belongsTo(db.EpisodeDiscussionResult)

db.Show.hasMany(db.RedditPollResult)
db.Week.hasMany(db.RedditPollResult)
db.EpisodeDiscussion.hasOne(db.RedditPollResult)
db.RedditPollResult.belongsTo(db.Show)
db.RedditPollResult.belongsTo(db.Week)
db.RedditPollResult.belongsTo(db.EpisodeDiscussion)

db.OverrideHistory.belongsTo(db.Token)

db.Season.hasMany(db.Week)
db.Week.belongsTo(db.Season)

db.EpisodeDiscussion.hasOne(db.EpisodeDiscussionResult)
db.EpisodeDiscussion.hasOne(db.EpisodeResultLink)


module.exports = db;
