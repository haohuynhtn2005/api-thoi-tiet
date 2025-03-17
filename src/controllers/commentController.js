const News = require('../models/News');

const commentController = {
  postComment: async (req, res) => {
    const userId = req.user?.userId;
    const { newsId, content } = req.body; // Get user ID and comment content from body
    try {
      // Find the news article
      const news = await News.findById(newsId);
      if (!news) {
        return res.status(404).json({ message: 'Không tìm thấy bài đăng' });
      }

      let message = '';
      // Find the user's comment within the news article
      let comment = news.comments.find((comment) => comment.user == userId);

      if (comment) {
        // If comment exists, update it
        comment.content = content;
        comment.updatedAt = new Date(); // Add an updated timestamp
        message = 'Comment updated successfully';
      } else {
        // If no comment exists, insert a new one
        comment = {
          user: userId,
          content,
        };
        news.comments.push(comment);
        message = 'Comment added successfully';
      }

      // Save the news document
      await news.save();

      res.status(200).json({ message, comment });
    } catch (error) {
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  },
};

module.exports = commentController;
