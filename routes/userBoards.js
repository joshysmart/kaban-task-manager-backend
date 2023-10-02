const express = require("express");

const {
  getUserBoardNames,
  getUserBoard,
  createUserBoard,
  updateUserBoard,
  deleteUserBoard,
  addNewTask,
  updateTask,
  deleteTask,
} = require("../controllers/userBoards");

const { protect } = require("../middleware/auth");

const router = express.Router();

// router.use(protect);

router.route("/:slug").get(getUserBoard);

router.route("/names/:userId").get(getUserBoardNames);

router
  .route("/")
  .post(createUserBoard)
  .put(updateUserBoard)
  .delete(deleteUserBoard);

router.route("/task").post(addNewTask).put(updateTask).delete(deleteTask);

module.exports = router;
