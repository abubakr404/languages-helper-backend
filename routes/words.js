const express = require("express");
const router = express.Router();

const {
  getAllWords,
  getWord,
  createWord,
  updateWord,
  deleteWord,
} = require("../controllers/words");

router.route("/").get(getAllWords).post(createWord);
router.route("/:id").get(getWord).patch(updateWord).delete(deleteWord);

module.exports = router;
