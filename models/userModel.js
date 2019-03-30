const Joi = require("joi");

module.exports = function(sequelize, DataTypes) {
  const User = sequelize.define(
    "User",
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      enabled: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      password_change_date: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },

    // freezeTableName will not add "s" to table name
    // underscored will add snake case _ to foreign key
    { freezeTableName: true, underScored: true }
  );

  User.associate = function(models) {
    User.belongsTo(models.Role, {
      foreignKey: {
        name: "role_id",
        allowNull: false
      }
    });
  };

  // validate new user creation
  User.validateUser = function(user) {
    const schema = {
      name: Joi.string()
        .min(5)
        .max(50)
        .required(),
      email: Joi.string()
        .min(5)
        .max(255)
        .required()
        .email(),
      password: Joi.string()
        .min(5)
        .max(255)
        .required(),
      role_id: Joi.number()
        .integer()
        .required()
    };

    return Joi.validate(user, schema);
  };

  // validate user login
  User.validateLogin = function(req) {
    const schema = {
      email: Joi.string()
        .required()
        .email(),
      password: Joi.string().required()
    };

    return Joi.validate(req, schema);
  };

  User.validatePasswordChange = function(req) {
    const schema = {
      password: Joi.string().required(),
      newPassword: Joi.string().required()
    };

    return Joi.validate(req, schema);
  };

  User.validateAdminPasswordChange = function(req) {
    const schema = {
      newPassword: Joi.string().required()
    };
    return Joi.validate(req, schema);
  };

  return User;
};
