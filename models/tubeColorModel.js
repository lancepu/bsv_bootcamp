module.exports = function(sequelize, DataTypes) {
  const Tube_Color = sequelize.define(
    "Tube_Color",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Tube_Color;
};
