module.exports = function(sequelize, DataTypes) {
  const Sample_Color = sequelize.define(
    "Sample_Color",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Sample_Color;
};
