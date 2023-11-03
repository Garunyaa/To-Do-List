import { User } from "../models/user-model";
import { Task } from "../models/task-model";
import { mailSender } from "../service/send-mail";
import { errorResponse, successResponse } from "../configs/response";
import cron from "node-cron";

// Create Task

export const createTask = async (req, res) => {
  try {
    const { title, description, deadline, status, created_by } = req.body;
    const newTask = new Task({
      title,
      description,
      deadline,
      status,
      created_by,
    });
    await newTask.save();
    return successResponse(res, 201, "Task created", newTask);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

// Update Task

export const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedFields = req.body;
    const updatedTask = await Task.findByIdAndUpdate(id, updatedFields, {
      new: true,
    });
    successResponse(res, 200, "Task updated", updatedTask);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

// Delete Task

export const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const task = await Task.findByIdAndDelete(id);
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }
    successResponse(res, 200, "Task deleted", { deleted_task: task });
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

// View today's tasks

export const viewTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const tasks = await Task.find({
      created_by: id,
      deadline: { $gte: currentDate, $lte: endOfDay },
    });
    successResponse(res, 200, "Tasks list", tasks);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

// Get past tasks

export const getPastTasks = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0, 0, 0, 0);
    const user = await User.findById(id);
    console.log(user, "user");
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const tasks = await Task.find({
      created_by: id,
      deadline: { $lt: currentDate },
    });
    successResponse(res, 200, "Tasks list", tasks);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

// Add comments to Task

export const addComments = async (req, res) => {
  try {
    const { task_id, comment } = req.body;
    const task = await Task.findByIdAndUpdate(
      task_id,
      { comments: comment },
      { new: true }
    );
    if (!task) {
      return errorResponse(res, 404, "Task not found");
    }
    await task.save();
    return successResponse(res, 201, "Added comments to task", task.comments);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};

// Send mail about Task status end of the day

export const mailEndOfTheDay = async (req, res) => {
  try {
    const { id } = req.params;
    const currentDate = new Date();
    currentDate.setHours(0.0, 0, 0);
    const endOfDay = new Date(currentDate);
    endOfDay.setHours(23, 59, 59, 999);
    const user = await User.findById(id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    const tasks = await Task.find({
      created_by: id,
      deadline: { $gte: currentDate, $lte: endOfDay },
    });
    cron.schedule("* 18 * * *", async () => {
      const subject = "To-Do list status";
      const text = `Your today's To-do list status is - ${tasks}`;

      mailSender(user.email, subject, text);
    });

    successResponse(res, 200, "Tasks list", tasks);
  } catch (error) {
    console.error(error);
    return errorResponse(res, 500, "Internal Server Error");
  }
};
