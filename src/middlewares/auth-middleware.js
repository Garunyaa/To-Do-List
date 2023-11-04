import jwt from "jsonwebtoken";
import { Admin } from "../models/admin-model";
import { User } from "../models/user-model";
import { errorResponse } from "../configs/response";

// Authenticate token for User

export const authTokenForUser = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return errorResponse(res, 400, "No token provided", {});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const user = await User.findOne({ name: decoded.name });
    if (user === null) {
      return errorResponse(res, 404, "User not found", {});
    } else if (user && decoded.id !== user._id.toString()) {
      return errorResponse(res, 403, "Forbidden", {});
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Authenticate token for Admin

export const authTokenForAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization");
    if (!token) {
      return errorResponse(res, 400, "No token provided", {});
    }
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    const admin = await Admin.find({ name: decoded.name });
    if (admin === null) {
      return errorResponse(res, 404, "Admin not found", {});
    } else if (!decoded) {
      return errorResponse(res, 403, "Forbidden", {});
    }
    next();
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
