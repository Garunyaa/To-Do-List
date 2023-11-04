import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./configs/db";
import { mailEndOfTheDay } from "./controllers/task-controller";
import adminRoutes from "./routes/admin-routes";
import userRoutes from "./routes/user-routes";
import taskRoutes from "./routes/task-routes";
dotenv.config();

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();
mailEndOfTheDay;

app.use("/api/admin", adminRoutes);
app.use("/api/user", userRoutes);
app.use("/api/user", taskRoutes);

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
