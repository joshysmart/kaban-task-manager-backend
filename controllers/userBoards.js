const UserBoard = require("../models/UserBoard");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get all user boards
// @route     GET /api/v1/user/boards
// @access    User
exports.getUserBoardNames = asyncHandler(async (req, res, next) => {
  const boards = await UserBoard.find({ user: req.params.userId }, "slug");
  if (!boards.length)
    return next(
      new ErrorResponse("No boards were found please create a board", 404)
    );
  return res.status(200).json({
    success: true,
    count: boards.length,
    data: boards,
  });
});

// @desc      Get one user board
// @route     GET /api/v1/user/boards/:boardId
// @access    User
exports.getUserBoard = asyncHandler(async (req, res, next) => {
  const boards = await UserBoard.findOne({ slug: req.params.slug });
  if (!boards)
    return next(
      new ErrorResponse("No boards were found please create a board", 404)
    );
  return res.status(200).json({
    success: true,
    data: boards,
  });
});

// @desc      create user board
// @route     POST /api/v1/user/boards
// @access    User
exports.createUserBoard = asyncHandler(async (req, res, next) => {
  const board = await UserBoard.create(req.body);
  res.status(201).json({ success: true, data: board });
});

// @desc      update user board
// @route     PUT /api/v1/user/boards
// @access    User
exports.updateUserBoard = asyncHandler(async (req, res, next) => {
  const userId = req.body.userId;
  const { name, columns } = req.body;
  let board = await UserBoard.findById(req.body.id);
  const columnNames = board.columns.map((column) => column.name);
  if (!board) {
    return next(ErrorResponse(`Board not found with`, 404));
  }
  if (board.user !== userId) {
    return next(ErrorResponse(`Not authorized`, 401));
  }
  if (columns.length < board.columns.length) {
    return next(
      ErrorResponse(`Columns cannot be less than ${board.columns.length}`, 400)
    );
  }
  if (name) board.name = name;
  columns.forEach((column, i) => {
    if (board.columns[i]) {
      board.columns[i].name = column.name;
      return;
    }
    if (columnNames.includes(column.name)) {
      return next(
        ErrorResponse(`Column name ${column.name} already exists`, 400)
      );
    }
    board.columns.push(column);
  });
  await board.save();
  res.status(200).json({ success: true, data: board });
});

// @desc      add new task to user board
// @route     PUT /api/v1/user/boards
// @access    User
exports.addNewTask = asyncHandler(async (req, res, next) => {
  const userId = req.body.userId;
  const board = await UserBoard.findById(req.body.id);
  if (!board) {
    return next(
      ErrorResponse(`Board not found with id of ${req.body.id}`, 404)
    );
  }
  if (board.user !== userId) {
    return next(ErrorResponse(`Not authorized`, 401));
  }
  const column = board.columns.find(
    (column) => column.name === req.body.status
  );
  if (!column) {
    return next(
      ErrorResponse(`Column not found with name of ${req.body.status}`, 404)
    );
  }
  const task = column.tasks.find((task) => task.title === req.body.title);
  if (task) {
    return next(
      ErrorResponse(`Task already exists with title of ${req.body.title}`, 400)
    );
  }
  column.tasks.push(req.body);
  await board.save();
  res.status(200).json({ success: true, data: board });
});

// @desc      update task in user board
// @route     PUT /api/v1/user/boards
// @access    User
exports.updateTask = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
});

// @desc      delete task in user board
// @route     PUT /api/v1/user/boards
// @access    User
exports.deleteTask = asyncHandler(async (req, res, next) => {
  res.status(200).json({ success: true, data: {} });
});

// @desc      delete user board
// @route     DELETE /api/v1/user/boards
// @access    User
exports.deleteUserBoard = asyncHandler(async (req, res, next) => {
  const userId = req.body.userId;
  let board = await UserBoard.findOne({ user: userId });
  if (!board) {
    return next(
      new ErrorResponse(`Board not found with id of ${req.params.id}`, 404)
    );
  }
  await board.remove();
  res.status(200).json({ success: true, data: {} });
});
