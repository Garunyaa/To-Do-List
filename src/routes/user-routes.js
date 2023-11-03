import express from "express";
import {
  userRegistration,
  userLogin,
  verifyOTP,
  uploadKycDocuments,
  viewKYCStatus,
} from "../controllers/user-controller";
import {
  userValidator,
  loginValidator,
  userIdValidator,
} from "../utils/validations/user-validation";
import { authTokenForUser } from "../middlewares/auth-middleware";
const router = express.Router();

router.post("/register", userValidator, userRegistration);
router.post("/verify-otp", verifyOTP);
router.post("/login", loginValidator, userLogin);
router.patch(
  "/upload-kyc/:id",
  authTokenForUser,
  userIdValidator,
  uploadKycDocuments
);
router.get("/kyc-status/:id", authTokenForUser, viewKYCStatus);

export default router;
