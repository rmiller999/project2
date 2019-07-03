'use strict';
module.exports = (sequelize, DataTypes) => {
  const game = sequelize.define('game', {
    apiId: DataTypes.INTEGER,
    name: DataTypes.STRING
  }, {});
  game.associate = function(models) {
    // associations can be defined here
    models.game.hasMany(models.comment);
  };
  return game;
};