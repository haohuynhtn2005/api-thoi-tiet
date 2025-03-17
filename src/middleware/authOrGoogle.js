const jwt = require('jsonwebtoken');
const admin = require('firebase-admin');

// Verify Firebase ID Token
const authOrGoogle = [
  (req, res, next) => {
    const token = req.cookies?.token;
    if (!token) return res.status(401).json({ message: 'Chưa đăng nhập' });

    try {
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      return next();
    } catch (err) {
      console.error('Auth auth or goo', err);
    }
    next();
  },
  async (req, res, next) => {
    if (req.user) return next();
    const token = req.cookies?.token;

    try {
      let verified = await admin.auth().verifyIdToken(token);
      req.user = verified;
      next();
    } catch (err) {
      console.error(err);
      res.status(401).json({ message: 'Session không hợp lệ' });
    }
  },
];

module.exports = authOrGoogle;
