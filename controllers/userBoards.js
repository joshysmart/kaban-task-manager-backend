const UserBoard = require("../models/UserBoard");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get all user boards
// @route     GET /api/v1/user/boards
// @access    User
exports.getUserBoards = asyncHandler(async (req, res, next) => {
  const boards = await UserBoard.find({ user: req.params.userId });

  return res.status(200).json({
    success: true,
    count: boards.length,
    data: boards
  });
});

// @desc      Get one user board
// @route     GET /api/v1/user/boards/:boardId
// @access    User
exports.getUserBoard = asyncHandler(async (req, res, next) => {
  const boards = await UserBoard.findById(req.params.boardId);

  return res.status(200).json({
    success: true,
    data: boards
  });
});

// @desc      create user board
// @route     POST /api/v1/user/boards
// @access    User
exports.createUserBoard = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  req.body.user = userId
  const board = await UserBoard.create(req.body);
  res.status(201).json({ success: true, data: board });
});

// @desc      update user board
// @route     PUT /api/v1/user/boards
// @access    User
exports.updateUserBoard = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  let board = await UserBoard.findOne({ user: userId });
  if (!board) {
    return next(new ErrorResponse(`Board not found with id of ${req.params.id}`, 404));
  }
  board = await UserBoard.findOneAndUpdate({ user: userId }, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({ success: true, data: board });
})

// @desc      delete user board
// @route     DELETE /api/v1/user/boards
// @access    User
exports.deleteUserBoard = asyncHandler(async (req, res, next) => {
  const userId = req.user.id
  let board = await UserBoard.findOne({ user: userId });
  if (!board) {
    return next(new ErrorResponse(`Board not found with id of ${req.params.id}`, 404));
  }
  await board.remove();
  res.status(200).json({ success: true, data: {} });
})