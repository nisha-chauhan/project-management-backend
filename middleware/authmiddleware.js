const jwt = require("jsonwebtoken");

const userTokenCheck = (req, res, next) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Not authorized, token missing" });
    }

    const token = header.split(" ")[1];
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error("JWT secret not configured");
    }

    const payload = jwt.verify(token, secret);
    req.user = { id: payload.id };

    next();
  } catch (err) {
    return res.status(401).json({
      message:
        process.env.NODE_ENV === "development" ? err.message : "Invalid token",
    });
  }
};

module.exports = { userTokenCheck };
