const express = require("express");
const router = express.Router();

const authRole = require("../middleware/role");

const {
  getAllGeneralWords,
  createGeneralWord,
  getGeneralWord,
  updateGeneralWord,
  deleteGeneralWord,
} = require("../controllers/generalWords");

router.route("/").get(getAllGeneralWords).post(authRole, createGeneralWord);
router
  .route("/:id")
  .get(getGeneralWord)
  .patch(authRole, updateGeneralWord)
  .delete(authRole, deleteGeneralWord);

module.exports = router;
