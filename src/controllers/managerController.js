const Location = require('../models/Location');
const User = require('../models/User');
const News = require('../models/News');

const managerController = {
  getOverview: async (req, res) => {
    try {
      const userCount = await User.where({ role: 'user' }).countDocuments();
      const staffCount = await User.where({ role: 'staff' }).countDocuments();
      const newsCount = await News.countDocuments();
      const locationCount = await Location.countDocuments();

      const latestLocations = await Location.find()
        .sort({ updatedAt: -1 })
        .limit(5);
      const latestNews = await News.find().sort({ createdAt: -1 }).limit(5);

      res.json({
        userCount,
        staffCount,
        newsCount,
        locationCount,
        latestLocations,
        latestNews,
      });
    } catch (error) {
      console.error('Error fetching overview data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
};

module.exports = managerController;
