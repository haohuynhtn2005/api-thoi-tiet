const haversine = require('../common/haversine');
const reverseGeocode = require('../common/reverseGeocode');
const updateWeatherInfo = require('../common/updateWeatherInfo');
const LocationModel = require('../models/LocationModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { Types } = require('mongoose');
const authMiddleware = require('../middleware/authMiddleware');
const getValidationError = require('../common/getValidationError');

const indexController = {
  getLocationOpts: async (req, res) => {
    const locations = await LocationModel.find().limit(1000);
    res.json(
      locations.map((loc) => {
        return {
          value: loc.code,
          label: loc.name,
        };
      })
    );
  },
  getRandomLocations: async (req, res) => {
    const locations = await LocationModel.find().limit(1000);
    const locationIndexes = [];
    for (let i = 0; i < locations.length; i += 1) {
      locationIndexes.push(i);
    }
    const targetIndexs = [];
    for (let i = 0; i < 12; i += 1) {
      const idx = Math.floor(Math.random() * locationIndexes.length);
      targetIndexs.push(locationIndexes[idx]);
      locationIndexes.splice(idx, 1);
    }
    targetIndexs.sort((a, b) => a - b);
    const resLocations = [];
    for (let i = 0; i < targetIndexs.length; i += 1) {
      const location = locations[targetIndexs[i]];
      await updateWeatherInfo(location);
      resLocations.push(location);
    }
    res.json(resLocations);
  },
  searchLocation: async (req, res) => {
    const locationCode = req.params.locationCode;
    const location = await LocationModel.findOne({ code: locationCode });
    if (!location) {
      return res.status(404).json({ message: 'Không tìm thấy khu vực' });
    }
    await updateWeatherInfo(location);
    res.json(location.weatherInfo);
  },
  reverseGeo: async (req, res) => {
    const { lat, lon } = req.body;

    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Missing 'lat' or 'lon' query parameter" });
    }

    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);

    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid latitude or longitude' });
    }

    const location = await reverseGeocode(latitude, longitude);

    if (!location) {
      return res
        .status(404)
        .json({ message: 'No address found for the given coordinates' });
    }

    await updateWeatherInfo(location);

    return res.json(location.weatherInfo);
  },
  nearbyLocations: async (req, res) => {
    const { lat, lon } = req.body;
    if (!lat || !lon) {
      return res
        .status(400)
        .json({ message: "Missing 'lat' or 'lon' query parameter" });
    }
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    if (isNaN(latitude) || isNaN(longitude)) {
      return res.status(400).json({ message: 'Invalid latitude or longitude' });
    }
    const locations = await LocationModel.find();
    locations.sort((a, b) => {
      const distanceA = haversine(
        lat,
        lon,
        a.coordinates.lat,
        a.coordinates.lon
      );
      const distanceB = haversine(
        lat,
        lon,
        b.coordinates.lat,
        b.coordinates.lon
      );
      return distanceA - distanceB;
    });
    const locationsToReturn = [];
    for (let i = 1; i < 9; i += 1) {
      const loc = locations[i];
      locationsToReturn.push(loc);
      await updateWeatherInfo(loc);
    }
    return res.json(locationsToReturn);
  },
  getLocations: async (req, res) => {
    try {
      const locations = await LocationModel.find().limit(100);

      res.json(
        locations.map((loc) => {
          loc = loc.toObject();
          const currentConditions = loc.weatherInfo.currentConditions;
          loc.weatherInfo = { currentConditions };
          return loc;
        })
      );
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
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
    authMiddleware,
    async function getUser(req, res) {
      const user = await User.findOne({
        _id: Types.ObjectId.createFromHexString(req.user.userId),
      });
      if (!user)
        return res.status(401).json({ message: 'Không tìm thấy tài khoản' });
      res.json({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    },
  ],
};

module.exports = indexController;
