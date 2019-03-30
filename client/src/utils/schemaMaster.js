import Joi from "joi-browser";

export const loginSchema = {
  email: Joi.string()
    .required()
    .email()
    .label("Email"),
  password: Joi.string()
    .required()
    .label("Password")
};

export const passwordChangeSchema = {
  password: Joi.string()
    .required()
    .label("Password"),
  newPassword: Joi.string()
    .required()
    .min(5)
    .label("New Password")
};

export const molecularSampleSubmitSchema = {
  labno: Joi.string()
    .required()
    .regex(/^([0-9]{8})+.*?/)
    .min(8)
    .max(11)
    .label("Labno"),
  specimen: Joi.number()
    .integer()
    .required()
    .label("Selection"),
  lab: Joi.number()
    .integer()
    .required()
    .label("Selection"),
  user: Joi.number().integer()
};

export const biochemSampleSubmitSchema = {
  labno: Joi.string()
    .required()
    .regex(/^[a-zA-Z]{3}[0-9]{8}/)
    .min(11)
    .max(11)
    .label("Labno"),
  specimen: Joi.number()
    .integer()
    .required()
    .label("Selection"),
  lab: Joi.number()
    .integer()
    .required()
    .label("Selection"),
  user: Joi.number().integer()
};

export const sampleFormSchema = {
  id: Joi.number()
    .integer()
    .required(),
  labno: Joi.string()
    .required()
    .regex(/^[a-zA-Z]{3}[0-9]{8}/)
    .min(11)
    .max(11)
    .label("Labno"),
  specimen: Joi.number()
    .integer()
    .required()
    .label("Selection"),
  tubeColor: Joi.number()
    .integer()
    .required()
    .label("Tube Color"),
  visualInspect: Joi.number()
    .integer()
    .required()
    .label("Visual Inspect"),
  preprocessComment: Joi.string()
    .max(5000)
    .allow(""),
  preprocessVolume: Joi.number().required(),
  sampleColor: Joi.number()
    .integer()
    .required()
    .label("Sample Color"),
  transparency: Joi.number()
    .integer()
    .required()
    .label("Transparency"),
  type: Joi.number()
    .integer()
    .required()
    .label("Type"),
  postprocessComment: Joi.string()
    .max(5000)
    .allow(""),
  postprocessVolume: Joi.number().required(),
  created: Joi.string()
};

export const biochemSearchSampleSchema = {
  labno: Joi.string()
    .required()
    .regex(/^[a-zA-Z]{3}[0-9]{8}/)
    .min(11)
    .max(11)
    .label("Labno")
};

export const ppvSchema = {
  labno: Joi.string()
    .required()
    .regex(/^[a-zA-Z]{3}[0-9]{8}/)
    .min(11)
    .max(11)
    .label("Labno"),
  sampleColor: Joi.number()
    .integer()
    .required()
    .label("Sample Color"),
  transparency: Joi.number()
    .integer()
    .required()
    .label("Transparency"),
  type: Joi.number()
    .integer()
    .required()
    .label("Type"),
  postprocessComment: Joi.string()
    .max(5000)
    .allow(""),
  postprocessVolume: Joi.number().required(),
  user: Joi.number().integer()
};

export const registerFormSchema = {
  email: Joi.string()
    .required()
    .email()
    .label("Email"),
  password: Joi.string()
    .required()
    .min(5)
    .label("Password"),
  name: Joi.string()
    .required()
    .min(5)
    .label("Name"),
  role: Joi.number()
    .integer()
    .required()
    .label("Role")
};

export const verifyFormSchema = {
  labno: Joi.string()
    .required()
    .regex(/^[a-zA-Z]{3}[0-9]{8}/)
    .min(11)
    .max(11)
    .label("Labno"),
  tubeColor: Joi.number()
    .integer()
    .required()
    .label("Tube Color"),
  visualInspect: Joi.number()
    .integer()
    .required()
    .label("Visual Inspect"),
  preprocessComment: Joi.string()
    .max(5000)
    .allow(""),
  preprocessVolume: Joi.number().required(),
  user: Joi.number().integer()
};
