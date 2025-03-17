const bcrypt = require('bcryptjs');
const User = require('../models/User');
const getValidationError = require('../common/getValidationError');
const { isValidObjectId } = require('mongoose');

const userController = {
  getUsers: (roles) => {
    return async (req, res) => {
      try {
        const users = await User.find({ role: { $in: roles } });
        res.json(users);
      } catch (error) {
        console.error('Error fetching users:', error);
        res.status(500).json({ message: 'Server error' });
      }
    };
  },

  createUser: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      const newUser = new User({ name, email, password: hashedPassword });
      await newUser.save();

      res.status(201).json({ message: 'Tao user thanh cong' });
    } catch (e) {
      if (e.name == 'ValidationError') {
        const validationError = getValidationError(e);
        return res.status(400).json({
          error: 'Bad request',
          validationError,
        });
      }
      console.error('Loi tao user', e);
      res.status(500).json({ error: e.message });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { id, name, email, password } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Id không hợp lệ' });
      }

      const updateData = { name, email };

      if (password) {
        const salt = await bcrypt.genSalt(10);
        updateData.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { $set: updateData },
        {
          new: true,
          runValidators: true,
        }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'User không tồn tại' });
      }

      res
        .status(200)
        .json({ message: 'Cập nhật user thành công', user: updatedUser });
    } catch (e) {
      if (e.name == 'ValidationError') {
        const validationError = getValidationError(e);
        return res.status(400).json({
          error: 'Bad request',
          validationError,
        });
      }
      console.error('Loi cap nhat user', e);
      res.status(500).json({ error: e.message });
    }
  },

  deleteUser: async (req, res) => {
    try {
      const { id } = req.body;

      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'Id không hợp lệ' });
      }

      const deletedUser = await User.findByIdAndDelete(id);

      if (!deletedUser) {
        return res.status(404).json({ message: 'User không tồn tại' });
      }

      res
        .status(200)
        .json({ message: 'Xóa user thành công', user: deletedUser });
    } catch (e) {
      console.error('Lỗi xóa user:', e);
      res.status(500).json({ error: e.message });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const { userId } = req.user; // Assuming user ID is stored in req.user from authentication middleware
      const { name, email, password } = req.body;

      let updatedFields = {};
      if (name) updatedFields.name = name;
      if (email) updatedFields.email = email;
      if (password) {
        const salt = await bcrypt.genSalt(10);
        updatedFields.password = await bcrypt.hash(password, salt);
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $set: updatedFields },
        { new: true, runValidators: true }
      );

      if (!updatedUser) {
        return res.status(404).json({ message: 'Không tìm thấy user' });
      }

      res
        .status(200)
        .json({ message: 'Cập nhật thành công', user: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Lỗi máy chủ', error });
    }
  },
};

module.exports = userController;
