const jwt = require("jsonwebtoken");
const { COOKIE_NAME } = require("../utils/constrants");

const createToken = (id, email, role, expiresIn = "7d") => {
  const payload = { id, email, role }; // ✅ id field is used
  return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });
};

const verifyToken = (req, res, next) => {
  const token = req.signedCookies[COOKIE_NAME];

  if (!token) {
    return res.status(401).json({ message: "No token found" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ✅ contains id, email, role
    console.log("✅ Decoded User:", req.user);
    next();
  } catch (err) {
    return res.status(403).json({ message: "Token verification failed", error: err.message });
  }
};

module.exports = {
  createToken,
  verifyToken,
};
