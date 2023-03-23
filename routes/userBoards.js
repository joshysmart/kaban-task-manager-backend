const express = require("express");

const { getUserBoards, getUserBoard, createUserBoard, updateUserBoard, deleteUserBoard } = require("../controllers/userBoards");

const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect);

router
  .route("/:userId")
  .get(getUserBoard)

router
  .route("/")
  .get(getUserBoards)
  .post(createUserBoard)
  .put(updateUserBoard)
  .delete(deleteUserBoard);


module.exports = router;
