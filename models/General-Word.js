const mongoose = require("mongoose");

const GeneralWordSchema = new mongoose.Schema(
  {
    word: {
      type: String,
      required: [true, "word is required"],
      unique: true,
      maxlength: 60,
    },
    sentence: {
      type: String,
      maxlength: 100,
    },
    createdBy: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "user is required"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("General-Words", GeneralWordSchema);
