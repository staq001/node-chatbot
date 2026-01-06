const jwt = require("jsonwebtoken");
const User = require("../model/user");
const auth = async (
  req,
  res,
  next
) => {
  try {
    const header = req.headers.authorization;

    if (!header || !header.startsWith("Bearer ")) {
      return res.status(401).json({
        status_code: 401,
        message: "Invalid Token. Please Log In",
      });
    }

    const token = header.split(" ")[1];
    if (!token)
      return res.status(401).json({
        status_code: 401,
        message: "Invalid Token. Please log in",
      });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decoded.id });

    if (!user)
      return res.status(404).json({
        status_code: 404,
        message: "Please Authenticate.",
      });

    req.user = user;
    req.user.password = "-";
    next();
  } catch (e) {
    res.status(401).json({ status: 401, message: "Please Authenticate" });
  }
};

module.exports = auth;