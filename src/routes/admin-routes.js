import express from "express";
const router = express.Router();
import { adminValidator } from "../utils/validations/admin-validation";
import {
  loginValidator,
  userIdValidator,
} from "../utils/validations/user-validation";
import {
  createAdmin,
  adminLogin,
  listAllUsers,
  blockUser,
  unblockUser,
  getUserInfo,
  reviewKYC,
  verifyKYC,
} from "../controllers/admin-controller";
import { authTokenForAdmin } from "../middlewares/auth-middleware";

router.post("/create-admin", adminValidator, createAdmin);
router.post("/login", loginValidator, adminLogin);
router.get("/list-all-users", authTokenForAdmin, listAllUsers);
router.patch("/block-user/:id", authTokenForAdmin, userIdValidator, blockUser);
router.patch(
  "/unblock-user/:id",
  authTokenForAdmin,
  userIdValidator,
  unblockUser
);
router.get(
  "/get-user-info/:id",
  authTokenForAdmin,
  userIdValidator,
  getUserInfo
);
router.get("/review-kyc", authTokenForAdmin, reviewKYC);
router.patch("/verify-kyc/:id", authTokenForAdmin, userIdValidator, verifyKYC);

export default router;
