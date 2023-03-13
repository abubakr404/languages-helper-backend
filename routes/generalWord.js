const express = require("express");
const router = express.Router();

const {
  getAllGeneralWords,
  createGeneralWord,
  getGeneralWord,
  updateGeneralWord,
  deleteGeneralWord,
} = require("../controllers/generalWords");

router.route("/").get(getAllGeneralWords).post(createGeneralWord);
router
  .route("/:id")
  .get(getGeneralWord)
  .patch(updateGeneralWord)
  .delete(deleteGeneralWord);

module.exports = router;
