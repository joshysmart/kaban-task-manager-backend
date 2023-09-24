const Board = require("../models/Board");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");


// @desc      get all boards
// @route     GET /api/v1/boards
// @access    Public
exports.getBoards = asyncHandler(async (req, res, next) => {
  res.status(200).json(res.advancedResults);
});

// @desc      get all board names
// @route     GET /api/v1/boards/names
// @access    Public
exports.getBoardNames = asyncHandler(async (req, res, next) => {
  const boardNames = await Board.find({}, 'slug')
  if (!boardNames.length) return next(new ErrorResponse('No board was found please create a board', 404))
  res.status(200).json({ success: true, data: boardNames });
})

// @desc      get single board by name
// @route     GET /api/v1/boards/:name
// @access    Public
exports.getBoard = asyncHandler(async (req, res, next) => {
  const board = await Board.findOne({ slug: req.params.slug })
  if (!board)
    return next(new ErrorResponse(`Board not found with name ${req.params.name}`, 404));
  res.status(200).json({ success: true, data: board });
})

// create and update not possible for public routes