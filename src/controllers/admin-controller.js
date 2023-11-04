import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Admin } from "../models/admin-model";
import { User } from "../models/user-model";
import { errorResponse, successResponse } from "../configs/response";

// Create Admin

export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const admin = new Admin({
      name,
      email,
      password: hashedPassword,
    });
    await admin.save();
    return successResponse(res, 201, "Admin Created Successfully", admin);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Admin Login

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    const admin = await Admin.findOne({ email: email });

    if (!email || !password) {
      return errorResponse(res, 400, "Invalid email or OTP", {});
    }
    const authToken = jwt.sign(
      { name: admin.name, email: admin.email, id: admin._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    const passwordMatch = await bcrypt.compare(password, admin.password);
    if (!passwordMatch) {
      return errorResponse(res, 400, "Incorrect password", {});
    }

    return successResponse(res, 200, "Login Successful", {
      admin,
      auth_token: authToken,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// List All Users

export const listAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return successResponse(res, 200, "Listing all users", users);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Block User

export const blockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found", {});
    }
    if (user.is_blocked === false) {
      user.is_blocked = true;
      await user.save();
    } else {
      return errorResponse(res, 400, "User already blocked", {});
    }
    successResponse(res, 200, "User blocked", { blocked_user: id });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Unblock User

export const unblockUser = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found", {});
    } else if (user.is_blocked === true) {
      user.status = false;
      await user.save();
      return successResponse(res, 200, "User unblocked", {
        unblocked_user: id,
      });
    } else {
      return errorResponse(res, 400, "User not blocked", {});
    }
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Get Information about a specific User

export const getUserInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id).select({ password: 0 }).exec();
    if (!user) {
      return errorResponse(res, 404, "User not found", {});
    }
    return successResponse(res, 200, "Specific user details", user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Review and Verify KYC

export const reviewKYC = async (req, res) => {
  try {
    const users = await User.find({
      kyc_document: { $exists: true },
    })
      .select({ password: 0 })
      .exec();
    if (!users) {
      return errorResponse(res, 404, "User not found", {});
    }
    return successResponse(res, 200, "KYC Document", users);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

export const verifyKYC = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found", {});
    }
    const kycVerification = await User.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    kycVerification.password = undefined;
    return successResponse(res, 200, "KYC Document Verified", kycVerification);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
