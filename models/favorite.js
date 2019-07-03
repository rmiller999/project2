'use strict';
module.exports = (sequelize, DataTypes) => {
  const favorite = sequelize.define('favorite', {
    userId: DataTypes.INTEGER,
    gameId: DataTypes.INTEGER,
    played: DataTypes.BOOLEAN
  }, {});
  favorite.associate = function(models) {
    // associations can be defined here
    model.favorite.belongsTo(models.user);
  };
  return favorite;
};