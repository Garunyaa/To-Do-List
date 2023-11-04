import express from "express";
import {
  userRegistration,
  userLogin,
  verifyOTP,
  viewKYCStatus,
} from "../controllers/user-controller";
import {
  userValidator,
  loginValidator,
  userIdValidator,
  OtpValidator,
} from "../utils/validations/user-validation";
import { uploadKycDocuments } from "../controllers/file-upload";
import { authTokenForUser } from "../middlewares/auth-middleware";
const router = express.Router();

router.post("/register", userValidator, userRegistration);
router.post("/verify-otp", OtpValidator, verifyOTP);
router.post("/login", loginValidator, userLogin);
router.patch(
  "/upload-kyc/:id",
  authTokenForUser,
  userIdValidator,
  uploadKycDocuments
);
router.get("/kyc-status/:id", authTokenForUser, userIdValidator, viewKYCStatus);

export default router;
