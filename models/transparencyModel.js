module.exports = function(sequelize, DataTypes) {
  const Transparency = sequelize.define(
    "Transparency",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Transparency;
};
