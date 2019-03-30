module.exports = function(sequelize, DataTypes) {
  const Type = sequelize.define(
    "Type",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Type;
};
