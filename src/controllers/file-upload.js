import multer from "multer";
import { User } from "../models/user-model";
import { successResponse, errorResponse } from "../configs/response";

// Upload KYC Documents

const storage = multer.diskStorage({
  destination: "src/utils/uploads",
  filename: function (req, file, cb) {
    const fileExtension = file.originalname.split(".").pop();
    cb(null, file.fieldname + "-" + Date.now() + "." + fileExtension);
  },
});

const upload = multer({
  storage: storage,
}).single("kyc document");

export const uploadKycDocuments = async (req, res) => {
  try {
    upload(req, res, async (error) => {
      if (error) {
        return errorResponse(res, 400, error.message);
      }
      if (!req.file) {
        return errorResponse(res, 400, "No file uploaded", {});
      }
      const { id } = req.params;
      const user = await User.findById(id);
      if (!user) {
        return errorResponse(res, 404, "User not found", {});
      }
      const newFile = await User.findByIdAndUpdate(id, {
        data: req.file.filename,
        content_type: req.file.mimetype,
      });
      user.kyc_document.push(newFile);
      await user.save();
      return successResponse(res, 201, "File uploaded", {
        document: user.kyc_document,
      });
    });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error", {
      error: error.message,
    });
  }
};
