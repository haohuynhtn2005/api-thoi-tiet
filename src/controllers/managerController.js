const LocationModel = require('../models/LocationModel');
const getValidationError = require('../common/getValidationError');

const managerController = {
  getLocations: async (req, res) => {
    try {
      const locations = await LocationModel.find().sort({ createdAt: -1 }).limit(100);

      res.json(locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  createLocation: async (req, res) => {
    try {
      const { code, name, region, lat, lon } = req.body;

      const newLocation = new LocationModel({
        code,
        name,
        region,
        coordinates: {
          lat,
          lon
        },
      });

      await newLocation.save();
      res.status(201).json(newLocation);
    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Loi du lieu vao',
          validationError: getValidationError(error)
        });
      }
      console.error('Error adding location:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  updateLocation: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, region, lat, lon } = req.body;

      const location = await LocationModel.findById(id);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      location.name = name;
      location.region = region;
      location.coordinates = { lat, lon };
      location.updatedAt = new Date();

      await location.save();
      res.json(location);

    } catch (error) {
      if (error.name === 'ValidationError') {
        return res.status(400).json({
          message: 'Loi cap nhat dia diem',
          validationError: getValidationError(error)
        });
      }
      console.error('Error updating location:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },

  deleteLocation: async (req, res) => {
    try {
      const { id } = req.params;
      const location = await LocationModel.findById(id);

      if (!location) {
        return res.status(404).json({ message: 'Location not found' });
      }

      await location.deleteOne();
      res.json({ message: 'Location deleted successfully' });

    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({ message: 'Server error' });
    }
  },
  
};

module.exports = managerController;
