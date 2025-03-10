const User = require("../models/User");

 function hasRole(roles = []) {
  return async (req, res, next) => {
    const user = await User.findById(req.user.userId);
    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: 'Không có quyền truy cập' });
    }
    next();
  };
}

module.exports = hasRole;
