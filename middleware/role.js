const { UnauthenticatedError } = require("../errors");

const roleAuth = async (req, res, next) => {
  if (!req.user.isAdmin)
    throw new UnauthenticatedError("No Authorized to access this route");
  next();
};

module.exports = roleAuth;
