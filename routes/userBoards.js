const express = require("express");

const {
  getUserBoardNames,
  getUserBoard,
  createUserBoard,
  updateUserBoard,
  deleteUserBoard,
  addNewTask,
  deleteTask,
  updateTask,
} = require("../controllers/userBoards");

const { protect } = require("../middleware/auth");
const { ClerkExpressWithAuth } = require("@clerk/clerk-sdk-node");

const router = express.Router();

router.route("/:slug").get(getUserBoard);

router.route("/names/:userId").get(getUserBoardNames);

router
  .use(ClerkExpressWithAuth(), protect)
  .route("/")
  .post(createUserBoard)
  .put(updateUserBoard)
  .delete(deleteUserBoard);

router
  .use(ClerkExpressWithAuth(), protect)
  .route("/task")
  .post(addNewTask)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
