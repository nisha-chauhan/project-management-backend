require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const connectDB = require("./connectdb");
const bodyParser = require("body-parser");
const authRoutes = require("../routes/authRoute");
const projectRoutes = require("../routes/projectRoute");
const taskRoutes = require("../routes/taskRoute");

const app = express();
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: false, limit: "50mb" }));
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/", (req, res) =>
  res.json({ ok: true, msg: "Project Management API" })
);

const PORT = process.env.PORT;

connectDB()
  .then(() => {
    app.listen(PORT, () =>
      console.log(`Server running on http://localhost:${PORT}`)
    );
  })
  .catch((err) => {
    console.error("DB connection failed", err);
    process.exit(1);
  });
