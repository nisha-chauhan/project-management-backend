const UserModel = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

async function generateToken(id) {
  const secret = process.env.JWT_SECRET || "secret123";
  const expiresIn = process.env.JWT_EXPIRES_IN || "7d";
  return jwt.sign({ id }, secret, { expiresIn });
}

// REGISTER
const UserRegister = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const exists = await UserModel.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already registered" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    const user = await UserModel.create({ email, password: hashed });
    const token = await generateToken(user._id);

    res.status(201).json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Error in UserRegister:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

// LOGIN
const UserLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email & password required" });

    const user = await UserModel.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const matched = await bcrypt.compare(password, user.password);
    if (!matched)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = await generateToken(user._id);

    res.json({
      token,
      user: { id: user._id, email: user.email },
    });
  } catch (err) {
    console.error("Error in UserLogin:", err);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

module.exports = { UserRegister, UserLogin };
