const News = require('../models/News');
const path = require('path');
const fs = require('fs');
const { isValidObjectId } = require('mongoose');

const newsController = {
  // Lấy danh sách tin tức
  getNews: async (req, res) => {
    let limit = parseInt(req.query.limit);
    if (isNaN(limit) || limit < 1) limit = 1000;
    limit = Math.min(limit, 1000);
    try {
      const newsData = await News.find().sort({ _id: -1 }).limit(limit);
      res.json(newsData);
    } catch (error) {
      res
        .status(500)
        .json({ message: 'Lỗi khi lấy dữ liệu', error: error.message });
    }
  },

  //Xem chi tiết tin tức
  getNewsById: async (req, res) => {
    try {
      let { id } = req.params;

      // Kiểm tra id có hợp lệ không
      if (!isValidObjectId(id)) {
        return res.status(400).json({ message: 'ID không hợp lệ' });
      }

      const news = await News.findById(id)
        .populate('author', 'name')
        .populate('comments.user', 'name content createdAt');

      if (!news) {
        return res.status(404).json({ message: 'Không tìm thấy bản tin' });
      }

      res.json(news);
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Lỗi server' });
    }
  },

  // Tạo tin tức mới
  createNews: async (req, res) => {
    try {
      const { title, description, category } = req.body;

      let imagePath = '';
      if (req.files && req.files.image) {
        const image = req.files.image;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(image.mimetype)) {
          return res.status(400).json({ message: 'Chỉ hỗ trợ JPG, JPEG, PNG' });
        }

        const extension = path.extname(image.name);
        const filename = `${Date.now()}${extension}`;
        const uploadDir = path.join(__dirname, '../public/uploads');

        imagePath = filename;
        await image.mv(path.join(uploadDir, filename));
      }

      const newNews = new News({
        title,
        description,
        category,
        image: imagePath,
      });
      await newNews.save();

      res
        .status(201)
        .json({ message: 'Tin tức đã được tạo thành công', data: newNews });
    } catch (error) {
      console.error('Lỗi khi tạo tin tức:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
  },

  // Cập nhật tin tức
  updateNews: async (req, res) => {
    try {
      const { id } = req.params;
      const { title, description, category } = req.body;

      const existingNews = await News.findById(id);
      if (!existingNews) {
        return res.status(404).json({ message: 'Không tìm thấy tin tức' });
      }

      let imagePath = existingNews.image;
      if (req.files && req.files.image) {
        const image = req.files.image;
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];

        if (!allowedTypes.includes(image.mimetype)) {
          return res.status(400).json({ message: 'Chỉ hỗ trợ JPG, JPEG, PNG' });
        }

        const extension = path.extname(image.name);
        const filename = `${Date.now()}${extension}`;
        const uploadDir = path.join(__dirname, '../public/uploads');

        imagePath = filename;
        await image.mv(path.join(uploadDir, filename));

        // Xóa ảnh cũ nếu có
        if (existingNews.image) {
          const oldImagePath = path.join(__dirname, '../', existingNews.image);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
      }

      existingNews.title = title || existingNews.title;
      existingNews.description = description || existingNews.description;
      existingNews.category = category || existingNews.category;
      existingNews.image = imagePath;

      await existingNews.save();
      res.json({ message: 'Tin tức đã được cập nhật', data: existingNews });
    } catch (error) {
      console.error('Lỗi khi cập nhật tin tức:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
  },

  // 🗑️ Xóa tin tức
  deleteNews: async (req, res) => {
    try {
      const { id } = req.params;
      const news = await News.findById(id);
      if (!news) {
        return res.status(404).json({ message: 'Không tìm thấy tin tức' });
      }

      // Xóa ảnh khỏi thư mục nếu có
      if (news.image) {
        const imagePath = path.join(
          __dirname,
          '../public/uploads/',
          news.image
        );
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      await News.findByIdAndDelete(id);
      res.json({ message: 'Tin tức đã được xóa thành công' });
    } catch (error) {
      console.error('Lỗi khi xóa tin tức:', error);
      res.status(500).json({ message: 'Đã xảy ra lỗi', error: error.message });
    }
  },
};

module.exports = newsController;
