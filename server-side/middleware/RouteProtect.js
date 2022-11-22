const jwt = require("jsonwebtoken");
const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const User = require("../model/User");

// Protect routes
exports.AuthProtect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  }

  if (!token) {
    return next(new ErrorResponse("Access denied to this route", 401));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    if (!req.user) {
      return res.status(401).json({
        success: false,
        error: "Access denied to this route",
        noAccess: true,
      });
    }
    next();
  } catch (err) {
    return next(new ErrorResponse("Access denied to this route", 401));
  }
});

exports.isActiveUser = asyncHandler((req, res, next) => {
  if (req.user?.status) {
    return next();
  }
  return res.status(403).json({
    success: false,
    error: "Your account has been  blocked",
    blocked: true,
  });
});
