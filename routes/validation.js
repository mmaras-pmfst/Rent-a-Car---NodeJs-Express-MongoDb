const Joi = require("@hapi/joi");

//#region //*USER REGISTRATION VALIDATION
const registerValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    userPassword: Joi.string().min(6).required(),
    userPassword2: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
//#endregion

//#region //*USER LOGIN VALIDATION
const loginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    userPassword: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
//#endregion

//#region //*ADMIN REGISTRATION VALIDATION
const adminRegisterValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    email: Joi.string().min(6).required().email(),
    adminPassword: Joi.string().min(6).required(),
    adminPassword2: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
//#endregion

//#region //*ADMIN LOGIN VALIDATION
const adminLoginValidation = (data) => {
  const schema = Joi.object({
    username: Joi.string().min(6).required(),
    adminPassword: Joi.string().min(6).required(),
  });
  return schema.validate(data);
};
//#endregion

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;
module.exports.adminRegisterValidation = adminRegisterValidation;
module.exports.adminLoginValidation = adminLoginValidation;
