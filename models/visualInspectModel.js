module.exports = function(sequelize, DataTypes) {
  const Visual_Inspect = sequelize.define(
    "Visual_Inspect",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Visual_Inspect;
};
