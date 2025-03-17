const mongoose = require('mongoose');

const NewsSchema = new mongoose.Schema(
  {
    title: String,
    description: String,
    category: {
      type: String,
      enum: ['Cảnh báo', 'Dự báo', 'Tổng hợp', 'Người dùng'], // Các danh mục hợp lệ
      required: true,
    },
    image: String, // Link ảnh minh họa
    createdAt: { type: Date, default: Date.now }, // Ngày đăng
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Tác giả
    comments: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }, // Người bình luận
        content: String, // Nội dung bình luận
        createdAt: { type: Date, default: Date.now }, // Thời gian bình luận
        updatedAt: { type: Date, default: Date.now }, // Thời gian bình luận
      },
    ], // Danh sách bình luận
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
