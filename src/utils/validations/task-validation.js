import Joi from "joi";
import { errorResponse } from "../../configs/response";
import { idValidator } from "../../helpers/id-validator";

const taskValidation = Joi.object({
  title: Joi.string(),
  description: Joi.string(),
  deadline: Joi.date(),
  comments: Joi.string(),
  status: Joi.string(),
  created_by: Joi.string(),
  created_at: Joi.date().default(new Date()),
});

export const taskValidator = async (req, res, next) => {
  try {
    const { error } = taskValidation.validate(req.body);
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

export const taskIdValidator = async (req, res, next) => {
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

export const taskIDValidator = async (req, res, next) => {
  try {
    if ((await idValidator(req.body.task_id)) == true) {
      next();
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
