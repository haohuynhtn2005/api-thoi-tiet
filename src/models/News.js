const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: String, // Tiêu đề bài viết
    description: String, // Mô tả ngắn
    category: {
      type: String,
      enum: ['Cảnh báo', 'Dự báo', 'Tổng hợp', 'Người dùng'], // Các danh mục hợp lệ
      required: true,
    },
    image: String, // Link ảnh minh họa
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tác giả
    createdAt: { type: Date, default: Date.now }, // Ngày đăng
  },
  {
    toObject: { virtuals: true },
    toJSON: { virtuals: true },
  }
);

NewsSchema.virtual('imageUrl').get(function () {
  return this.image
    ? `${process.env.BASE_URL}/public/uploads/${this.image}`
    : null;
});

const News = mongoose.model('News', NewsSchema);

module.exports = News;
