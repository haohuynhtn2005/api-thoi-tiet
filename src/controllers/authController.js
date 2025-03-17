const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const admin = require('firebase-admin');
const getValidationError = require('../common/getValidationError');
const authOrGoogle = require('../middleware/authOrGoogle');

const auhtController = {
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'User registered successfully' });
    } catch (e) {
      if (e.name == 'ValidationError') {
        const validationError = getValidationError(e);
        return res.status(400).json({
          error: 'Bad request',
          validationError,
        });
      }
      console.error('Loi dang ky', e);
      res.status(500).json({ error: e.message });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email });

      if (!user)
        return res.status(400).json({ message: 'Không tìm thấy tài khoản' });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ message: 'Sai mật khẩu' });

      const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      res.cookie('token', token, { httpOnly: true, secure: false });
      res.json({ message: 'Login successful', token });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  },

  logout: (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
  },

  getUser: [
    authOrGoogle,
    async function getUser(req, res) {
      const { userId, uid } = req.user;

      const user = userId
        ? await User.findById(userId)
        : await User.findOne({ uid });

      if (!user)
        return res.status(401).json({ message: 'Không tìm thấy tài khoản' });
      res.json({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      });
    },
  ],

  authGoogle: async (req, res) => {
    const { idToken } = req.body;

    try {
      const decodedToken = await admin.auth().verifyIdToken(idToken);
      const { uid, name, email } = decodedToken;

      let user = await User.findOne({ uid });

      if (!user) {
        // Save new user
        user = new User({ uid, name, email, password: uid });
        await user.save();
      } else {
        user.name = name;
        user.email = email;
        await user.save();
      }

      // Generate JWT
      const token = jwt.sign({ uid, name, email }, process.env.JWT_SECRET, {
        expiresIn: '24h',
      });

      // Set token in cookie
      res.cookie('token', token, { httpOnly: true, secure: false });
      res.json({
        message: 'Login successful',
        user: { uid, name, email },
        token,
      });
    } catch (error) {
      console.error('Error authGoogle', error);
      res.status(401).json({ message: 'Invalid Firebase ID token' });
    }
  },
};

module.exports = auhtController;
