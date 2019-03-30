const Joi = require("joi");

module.exports = function(sequelize, DataTypes) {
  const Sample = sequelize.define(
    "Sample",
    {
      labno: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      preprocess_comment: {
        type: DataTypes.STRING
      },
      postprocess_comment: {
        type: DataTypes.STRING
      },
      preprocess_volume: {
        type: DataTypes.DOUBLE
      },
      postprocess_volume: {
        type: DataTypes.DOUBLE
      }
    },

    // freezeTableName will not add "s" to table name
    // underscored will add snake case _ to foreign key
    { freezeTableName: true, underscored: true }
  );

  Sample.associate = function(models) {
    Sample.belongsTo(models.User, {
      as: "submit_user",
      foreignKey: {
        name: "submit_user_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.User, {
      as: "verify_user",
      foreignKey: {
        name: "verify_user_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.User, {
      as: "ppv_user",
      foreignKey: {
        name: "ppv_user_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Specimen, {
      foreignKey: {
        name: "specimen_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Sample_Color, {
      foreignKey: {
        name: "sample_color_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Transparency, {
      foreignKey: {
        name: "transparency_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Type, {
      foreignKey: {
        name: "type_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Tube_Color, {
      foreignKey: {
        name: "tube_color_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Visual_Inspect, {
      foreignKey: {
        name: "visual_inspect_id",
        allowNull: true
      }
    });
    Sample.belongsTo(models.Lab, {
      foreignKey: {
        name: "lab_id",
        allowNull: true
      }
    });
  };

  Sample.validateSample = function(sample) {
    const schema = {
      id: Joi.number()
        .integer()
        .required(),
      labno: Joi.string()
        // THIS REGEX DICTATES FIRST 3 LETTERS MUST BE A LETTER AND REST 8 MUST BE NUMBERS
        .regex(/^[a-zA-Z]{3}[0-9]{8}/)
        .min(11)
        .max(11)
        .required(),
      preprocess_comment: Joi.string()
        .max(5000)
        .allow(""),
      postprocess_comment: Joi.string()
        .max(5000)
        .allow(""),
      preprocess_volume: Joi.number(),
      postprocess_volume: Joi.number(),
      specimen_id: Joi.number().integer(),
      sample_color_id: Joi.number().integer(),
      transparency_id: Joi.number().integer(),
      type_id: Joi.number().integer(),
      tube_color_id: Joi.number().integer(),
      visual_inspect_id: Joi.number().integer()
    };
    return Joi.validate(sample, schema);
  };

  Sample.validateSampleSubmit = function(sample) {
    const schema = {
      labno: Joi.string()
        // THIS REGEX DICTATES FIRST 3 LETTERS MUST BE A LETTER AND REST 8 MUST BE NUMBERS
        //.regex(/^[a-zA-Z]{3}[0-9]{8}/)
        .min(8)
        .max(11)
        .required(),
      specimen_id: Joi.number()
        .integer()
        .required(),
      submit_user_id: Joi.number()
        .integer()
        .required(),
      lab_id: Joi.number()
        .integer()
        .required()
    };

    return Joi.validate(sample, schema);
  };

  Sample.validateSampleVerify = function(sample) {
    const schema = {
      labno: Joi.string()
        // THIS REGEX DICTATES FIRST 3 LETTERS MUST BE A LETTER AND REST 8 MUST BE NUMBERS
        .regex(/^[a-zA-Z]{3}[0-9]{8}/)
        .min(11)
        .max(11)
        .required(),
      preprocess_comment: Joi.string()
        .max(5000)
        .allow(""),
      preprocess_volume: Joi.number().required(),
      verify_user_id: Joi.number()
        .integer()
        .required(),
      tube_color_id: Joi.number()
        .integer()
        .required(),
      visual_inspect_id: Joi.number()
        .integer()
        .required()
    };

    return Joi.validate(sample, schema);
  };

  Sample.validateSamplePPV = function(sample) {
    // SAMPLE POST PROCESSING VERIFICATION
    const schema = {
      labno: Joi.string()
        // THIS REGEX DICTATES FIRST 3 LETTERS MUST BE A LETTER AND REST 8 MUST BE NUMBERS
        .regex(/^[a-zA-Z]{3}[0-9]{8}/)
        .min(11)
        .max(11)
        .required(),
      postprocess_comment: Joi.string()
        .max(5000)
        .allow(""),
      postprocess_volume: Joi.number().required(),
      // POST PROCESSING VERIFY USER ID
      ppv_user_id: Joi.number()
        .integer()
        .required(),
      sample_color_id: Joi.number()
        .integer()
        .required(),
      transparency_id: Joi.number()
        .integer()
        .required(),
      type_id: Joi.number()
        .integer()
        .required()
    };

    return Joi.validate(sample, schema);
  };

  return Sample;
};
