'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define('favorite', {
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    played: DataTypes.BOOLEAN,
    name: DataTypes.STRING
  }, {});
  favorite.associate = function(models) {
    // associations can be defined here
  };
  return favorite;
};