const User = require("../models/User");
const Word = require("../models/Word");
const { StatusCodes } = require("http-status-codes");
const { NotFoundError } = require("../errors");
const bcrypt = require("bcryptjs");

const getAllUsers = async (req, res) => {
  const users = await User.find({}).sort("createdAt");
  res.status(StatusCodes.OK).json({ count: users.length, data: users });
};

const createUser = async (req, res) => {
  const user = await User.create(req.body);
  res.status(StatusCodes.CREATED).json(user);
};

const getUser = async (req, res) => {
  const {
    user: { userId, isAdmin },
    params: { id: userID },
  } = req;
  if (!isAdmin && userId !== userID)
    throw new UnauthenticatedError("No Authorized to access this route");
  const user = await User.findOne({ _id: userID });
  if (!user) {
    throw new NotFoundError(`there is no user with id: ${userID}`);
  }
  res.status(StatusCodes.OK).json(user);
};

const updateUser = async (req, res) => {
  const {
    user: { userId, isAdmin },
    params: { id: userID },
  } = req;
  if (!isAdmin && req.body.isAdmin) req.body.isAdmin = false;
  if (!isAdmin && userId !== userID)
    throw new UnauthenticatedError("No Authorized to access this route");
  if (req.body.password) {
    const salt = await bcrypt.genSalt(10);
    req.body.password = await bcrypt.hash(req.body.password, salt);
  }
  const user = await User.findOneAndUpdate({ _id: userID }, req.body, {
    new: true,
    runValidators: true,
  });
  if (!user) {
    throw new NotFoundError(`there is no user with id: ${userID}`);
  }
  res.status(StatusCodes.OK).json({ success: true, data: { user } });
};

const deleteUser = async (req, res) => {
  const {
    params: { id: userID },
  } = req;
  const user = await User.findOneAndDelete({ _id: userID });
  if (!user) {
    throw new NotFoundError(`there is no user with id: ${userID}`);
  }

  const words = await Word.deleteMany({ createdBy: userID });
  res.status(StatusCodes.OK).send();
};

module.exports = {
  getAllUsers,
  createUser,
  getUser,
  updateUser,
  deleteUser,
};
