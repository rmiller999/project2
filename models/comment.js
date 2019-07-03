'use strict';
module.exports = (sequelize, DataTypes) => {
  const comment = sequelize.define('comment', {
    gameId: DataTypes.INTEGER,
    content: DataTypes.STRING,
    userId: DataTypes.INTEGER
  }, {});
  comment.associate = function(models) {
    // associations can be defined here
    model.comment.belongsTo(models.game);
  };
  return comment;
};