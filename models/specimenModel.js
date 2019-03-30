module.exports = function(sequelize, DataTypes) {
  const Specimen = sequelize.define(
    "Specimen",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Specimen;
};
