const express = require("express");
const Board = require("../models/Board");

const { getBoards, getBoard } = require("../controllers/boards");
const advancedResults = require("../middleware/advancedResults");


const router = express.Router();

router
  .route("/")
  .get(advancedResults(Board), getBoards)

router
  .route("/:boardId")
  .get(getBoard);

module.exports = router;
