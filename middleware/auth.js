const asyncHandler = require("./async");
const ErrorResponse = require("../utils/errorResponse");
const jwt = require("jsonwebtoken");

// Protect routes
exports.protect = asyncHandler(async (req, res, next) => {
  const userId = req.auth.userId;
  if (!userId) {
    return next(new ErrorResponse("Not authorized to access this route", 401));
  }
  next();
});
