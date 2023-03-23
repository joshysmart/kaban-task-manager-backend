const Board = require("../models/Board");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");


// @desc      get all boards
// @route     GET /api/v1/boards
// @access    Public
exports.getBoards = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      get single board
// @route     GET /api/v1/boards/:boardId
// @access    Public
exports.getBoard = asyncHandler(async (req, res, next) => {
  const board = await Board.findById(req.params.boardId);
  if (!board) {
    return next(new ErrorResponse(`Board not found with id of ${req.params.id}`, 404));
  }
  res.status(200).json({ success: true, data: board });
})

// create and update not possible for public routes