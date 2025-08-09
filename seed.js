/**
 * Seed script:
 * Creates one user test@example.com / Test@123
 * Adds 2 projects and 3 tasks per project
 *
 * Run: npm run seed
 */
require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const User = require("./models/userModel");
const Project = require("./models/projectModel");
const Task = require("./models/taskModel");

const MONGO_URI = process.env.MONGO_URI;

async function run() {
  await mongoose.connect(MONGO_URI);
  console.log("Connected to DB for seeding");

  // Clean up existing seed user data (safe)
  await Task.deleteMany({});
  await Project.deleteMany({});
  await User.deleteMany({ email: "test@example.com" });

  const salt = await bcrypt.genSalt(10);
  const hashed = await bcrypt.hash("Test@123", salt);

  const user = await User.create({
    email: "test@example.com",
    password: hashed,
    name: "test",
    designation: "test",
    mobileNo: "000000000",
  });
  console.log("Created user:", user.email);

  const projectsData = [
    {
      title: "Website Revamp",
      description: "Revamp landing & dashboard UI",
      status: "ACTIVE",
      creater_id: user._id,
    },
    {
      title: "Mobile App",
      description: "MVP for mobile app",
      status: "ACTIVE",
      creater_id: user._id,
    },
  ];

  for (const p of projectsData) {
    const project = await Project.create({ ...p, user_id: user._id });
    console.log("Created project:", project.title);

    const tasks = [
      {
        title: `${project.title} - Task 1`,
        description: "First task",
        status: "IN_PROGRESS",
        creater_id: user._id,
      },
      {
        title: `${project.title} - Task 2`,
        description: "Second task",
        status: "IN_PROGRESS",
        creater_id: user._id,
      },
      {
        title: `${project.title} - Task 3`,
        description: "Third task",
        status: "COMPLETED",
        creater_id: user._id,
      },
    ];

    for (const t of tasks) {
      await Task.create({
        ...t,
        project_id: project._id,
        dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });
    }
    console.log("Created 3 tasks for project:", project.title);
  }

  console.log("Seeding completed.");
  process.exit(0);
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
