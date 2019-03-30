module.exports = function(sequelize, DataTypes) {
  const Lab = sequelize.define(
    "Lab",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      }
    },

    { freezeTableName: true, timestamps: false }
  );

  return Lab;
};
