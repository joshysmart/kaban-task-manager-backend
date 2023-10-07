const UserBoard = require("../models/UserBoard");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

// @desc      Get all user boards
// @route     GET /api/v1/boards/user
// @access    User
exports.getUserBoardNames = asyncHandler(async (req, res, next) => {
  const userId = req.params.userId;
  const boards = await UserBoard.find({ user: userId }, "slug");
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
// @route     GET /api/v1/boards/user/:boardId
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
// @route     POST /api/v1/boards/user
// @access    User
exports.createUserBoard = asyncHandler(async (req, res, next) => {
  const board = await UserBoard.create(req.body);
  res.status(201).json({ success: true, data: board });
});

// @desc      update user board
// @route     PUT /api/v1/boards/user
// @access    User
exports.updateUserBoard = asyncHandler(async (req, res, next) => {
  const { name, columns } = req.body;
  let board = await UserBoard.findById(req.body.id);
  const columnNames = board.columns.map((column) => column.name);
  if (!board) {
    return next(new ErrorResponse(`Board not found`, 404));
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
        new ErrorResponse(`Column name ${column.name} already exists`, 400)
      );
    }
    board.columns.push(column);
  });
  await board.save();
  res.status(200).json({ success: true, data: board });
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

// @desc      add new task to user board
// @route     PUT /api/v1/boards/user
// @access    User
exports.addNewTask = asyncHandler(async (req, res, next) => {
  const board = await UserBoard.findById(req.body.id);
  if (!board) {
    return next(
      new ErrorResponse(`Board not found with id of ${req.body.id}`, 404)
    );
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
      new ErrorResponse(
        `Task already exists with title of ${req.body.title}`,
        400
      )
    );
  }
  column.tasks.push(req.body);
  await board.save();
  res.status(200).json({ success: true, data: board });
});

// @desc      update task in user board
// @route     PUT /api/v1/boards/user/task
// @access    User
exports.updateTask = asyncHandler(async (req, res, next) => {
  const board = await UserBoard.findOne({
    "columns.tasks._id": req.body.taskId,
  });
  if (!board) {
    return next(
      new ErrorResponse(`Board not found with id of ${req.body.id}`, 404)
    );
  }
  const column = board.columns.find(
    (column) => column.name === req.body.status
  );
  if (!column) {
    return next(
      new ErrorResponse(`Column not found with name of ${req.body.status}`, 404)
    );
  }
  // find the index of the task in the column
  const taskIndex = column.tasks.findIndex(
    (task) => task._id.toString() === req.body.taskId
  );
  // if the task is not found
  if (taskIndex === -1) {
    //delete the task from the old column
    // find the old column
    const oldColumn = board.columns.find(
      (column) => column.name === req.body.oldStatus
    );
    // find the index of the task in the old column
    const oldTaskIndex = oldColumn.tasks.findIndex(
      (task) => task._id.toString() === req.body.taskId
    );

    if (oldTaskIndex === -1) {
      return next(new ErrorResponse(`Task not found`, 404));
    }

    // delete the task from the old column
    oldColumn.tasks.splice(oldTaskIndex, 1);
    // add the task to the new column
    column.tasks.push(req.body);
  } else {
    // replace the task with the new task
    column.tasks[taskIndex] = req.body;
  }
  await board.save();
  res.status(200).json({ success: true, data: board });
});

// @desc      delete task in user board
// @route     PUT /api/v1/user/boards
// @access    User
exports.deleteTask = asyncHandler(async (req, res, next) => {
  const board = await UserBoard.findOne({
    "columns.tasks._id": req.body.taskId,
  });
  if (!board) {
    return next(
      new ErrorResponse(`Board not found with id of ${req.body.id}`, 404)
    );
  }

  const column = board.columns.find(
    (column) => column.name === req.body.status
  );
  if (!column) {
    return next(
      new ErrorResponse(`Column not found with name of ${req.body.status}`, 404)
    );
  }
  // find the index of the task in the column
  const taskIndex = column.tasks.findIndex(
    (task) => task._id.toString() === req.body.taskId
  );
  // if the task is not found
  if (taskIndex === -1) {
    return next(new ErrorResponse(`Task not found`, 404));
  }
  // delete the task from the column
  column.tasks.splice(taskIndex, 1);
  await board.save();

  res.status(200).json({ success: true, data: {} });
});
