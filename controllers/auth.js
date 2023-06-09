const User = require("../models/User");
const { StatusCodes } = require("http-status-codes");
const { BadRequestError, UnauthenticatedError } = require("../errors");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    throw new BadRequestError("please fill all fileds name and email and password");
  if (req.body.isAdmin) req.body.isAdmin = false;

  const user = await User.create({ ...req.body });
  const token = user.genToken();
  res
    .status(StatusCodes.CREATED)
    .json({ user: { name: user.name, email: user.email, id: user._id }, token });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new BadRequestError("please provide email and password");

  const user = await User.findOne({ email });

  if (!user) throw new UnauthenticatedError("Invalid Credentials");

  const isPasswordCorrect = await user.comparePassword(password);
  if (!isPasswordCorrect) throw new UnauthenticatedError("Invalid Credentials");

  const token = user.genToken();
  res
    .status(StatusCodes.OK)
    .json({ user: { name: user.name, email: user.email, id: user._id }, token });
};

module.exports = {
  register,
  login,
};
