const express = require("express");
const router = express.Router();
const authRole = require("../middleware/role");

const {
  getAllUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
} = require("../controllers/users");

router.route("/").get(authRole, getAllUsers).post(authRole, createUser);
router.route("/:id").get(getUser).patch(updateUser).delete(authRole, deleteUser);

module.exports = router;
