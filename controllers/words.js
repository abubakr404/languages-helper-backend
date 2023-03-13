const Word = require("../models/Word");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllWords = async (req, res) => {
  const words = await Word.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: words.length, data: words });
};

const createWord = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const word = await Word.create(req.body);
  res.status(StatusCodes.CREATED).json(word);
};

const getWord = async (req, res) => {
  const {
    user: { userId },
    params: { id: wordID },
  } = req;
  const word = await Word.findOne({ createdBy: userId, _id: wordID });
  if (!word) {
    throw new NotFoundError(`there is no word with id: ${wordID}`);
  }
  res.status(StatusCodes.OK).json(word);
};

const updateWord = async (req, res) => {
  const {
    body: { company, position },
    user: { userId },
    params: { id: wordID },
  } = req;
  if (company === "" || position === "") {
    throw new BadRequestError(`company or position fields cannot be empty`);
  }
  const word = await Word.findOneAndUpdate({ createdBy: userId, _id: wordID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!word) {
    throw new NotFoundError(`there is no word with id: ${wordID}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: word });
};

const deleteWord = async (req, res) => {
  const {
    user: { userId },
    params: { id: wordID },
  } = req;
  const word = await Word.findOneAndDelete({ createdBy: userId, _id: wordID });
  if (!word) {
    throw new NotFoundError(`there is no word with id: ${wordID}`);
  }
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllWords,
  createWord,
  getWord,
  updateWord,
  deleteWord,
};
