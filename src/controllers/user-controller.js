import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/user-model";
import { mailSender } from "../service/send-mail";
import { successResponse, errorResponse } from "../configs/response";

// User Registration

export const userRegistration = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      name,
      email,
      password: hashedPassword,
    });
    await user.save();
    return successResponse(res, 201, "User Registered Successfully", user);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// Send OTP for verification

export const verifyOTP = async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return errorResponse(res, 404, "User not found", {});
    }
    const otp = Math.floor(100000 + Math.random() * 900000);
    user.otp = otp;
    await user.save();

    const subject = "Verification OTP for Login";
    const text = `Your Login Verification OTP is ${otp}`;

    await mailSender(user.email, subject, text);
    return successResponse(res, 200, "OTP sent successfully", { OTP: otp });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// User login using OTP or password

export const userLogin = async (req, res) => {
  try {
    const { email, password, otp } = req.body;
    const user = await User.findOne({ email, otp });

    if (!user) {
      return errorResponse(res, 400, "Invalid email or OTP", {});
    }
    const authToken = jwt.sign(
      { name: user.name, email: user.email, id: user._id },
      process.env.SECRET_KEY,
      { expiresIn: "1d" }
    );
    user.otp = null;
    await user.save();

    if (password) {
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return errorResponse(res, 400, "Incorrect password", {});
      }
    }
    user.password = undefined;
    return successResponse(res, 200, "Login Successful", {
      user,
      auth_token: authToken,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};

// View KYC verification status

export const viewKYCStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found", {});
    }
    return successResponse(res, 200, "KYC verifiation status", {
      name: user.name,
      kyc_status: user.kyc_verified,
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
