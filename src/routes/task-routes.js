import express from "express";
import {
  createTask,
  updateTask,
  deleteTask,
  viewTasks,
  addComments,
  getPastTasks,
  mailEndOfTheDay,
} from "../controllers/task-controller";
import { authTokenForUser } from "../middlewares/auth-middleware";
import {
  taskValidator,
  taskIdValidator,
  taskIDValidator,
} from "../utils/validations/task-validation";
import { userIdValidator } from "../utils/validations/user-validation";
const router = express.Router();

router.post("/create-task", authTokenForUser, taskValidator, createTask);
router.patch("/update-task/:id", authTokenForUser, taskIdValidator, updateTask);
router.delete(
  "/delete-task/:id",
  authTokenForUser,
  taskIdValidator,
  deleteTask
);
router.get("/view-tasks/:id", authTokenForUser, userIdValidator, viewTasks);
router.get(
  "/past-day-tasks/:id",
  authTokenForUser,
  userIdValidator,
  getPastTasks
);
router.patch("/add-comments", authTokenForUser, taskIDValidator, addComments);
router.get("/get-mails/:id", userIdValidator, mailEndOfTheDay);

export default router;
