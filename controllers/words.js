const Word = require("../models/Word");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, NotFoundError } = require("../errors");

const getAllWords = async (req, res) => {
  const words = await Word.find({ createdBy: req.user.userId }).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: words.length, data: words });
};

const createWord = async (req, res) => {
  req.body.createdBy = req.user.userId;
  const isWordExist = await Word.findOne({
    createdBy: req.body.createdBy,
    word: req.body.word,
  });
  if (isWordExist) {
    throw new BadRequestError(
      `Duplicated value !! The word "${req.body.word}" is already exist`
    );
  }
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
    body: { word, level },
    user: { userId },
    params: { id: wordID },
  } = req;
  if (word === "" || level === "") {
    throw new BadRequestError(`word or level fields cannot be empty`);
  }
  const localWord = await Word.findOneAndUpdate(
    { createdBy: userId, _id: wordID },
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );
  if (!localWord) {
    throw new NotFoundError(`there is no word with id: ${wordID}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: { word: localWord } });
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
