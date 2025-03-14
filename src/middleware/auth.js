const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  const token = req.cookies?.token;
  if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    console.error(err);
    res.status(401).json({ message: 'Session không hợp lệ' });
  }
};

module.exports = auth;
