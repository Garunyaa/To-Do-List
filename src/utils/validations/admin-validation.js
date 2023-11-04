import Joi from "joi";
import { errorResponse } from "../../configs/response";

// Admin Validation

const adminValidation = Joi.object({
  name: Joi.string().required().min(3).max(20),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  status: Joi.number().default(1),
  created_at: Joi.date().default(new Date()),
});

export const adminValidator = (req, res, next) => {
  try {
    const { error } = adminValidation.validate(req.body);
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
