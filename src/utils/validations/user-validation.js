import Joi from "joi";
import { errorResponse } from "../../configs/response";
import { idValidator } from "../../helpers/id-validator";

// User Validation

const userValidation = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  kyc_document: Joi.string(),
  kyc_status: Joi.boolean(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const userValidator = (req, res, next) => {
  try {
    const { error } = userValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 404, { error: error.details[0].message }, {});
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Login Validation

const loginValidation = Joi.object({
  email: Joi.string().email(),
  password: Joi.string(),
  otp: Joi.string(),
});

export const loginValidator = (req, res, next) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 404, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// ID Validator

export const userIdValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.params.id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// send-OTP Validator

export const OtpValidator = (req, res, next) => {
  try {
    const { error } = loginValidation.validate(req.body);
    if (error) {
      return errorResponse(res, 404, { error: error.details[0].message });
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
