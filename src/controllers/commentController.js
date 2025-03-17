const News = require('../models/News');
const User = require('../models/User');

const commentController = {
  postComment: async (req, res) => {
    let { userId, uid } = req.user;
    const { newsId, content } = req.body; // Get user ID and comment content from body
    try {
      if (!userId) {
        userId = (await User.findOne({ uid }))?.id;
      }

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
