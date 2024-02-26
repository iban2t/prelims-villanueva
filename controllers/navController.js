const db = require("../database");

// Add a new location
exports.addLocation = async (req, res) => {
    try {
        const userId = req.userId;
        const { name, latitude, longitude } = req.body;

        if (!name || !latitude || !longitude) {
          return res.status(400).json({ error: 'Invalid input', message: 'Please provide name, latitude, and longitude' });
      }

        const createLocationQuery = 'INSERT INTO location (name, user_id, coordinates) VALUES (?, ?, POINT(?, ?))';
        await db.promise().execute(createLocationQuery, [name, userId, latitude, longitude]);
        
        res.status(201).json({ message: 'Location created successfully' });
    } catch (error) {
        console.error('Error adding location:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// Get all locations
exports.getAllLocations = async (req, res) => {
    try {
        const userId = req.userId;
        const getAllLocationsQuery = 'SELECT * FROM location WHERE user_id = ?';
        const [locations] = await db.promise().execute(getAllLocationsQuery, [userId]);

        res.json(locations);
    } catch (error) {
      console.error('Error getting locations:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Get location by ID
exports.getLocationById = async (req, res) => {
    try {
        const locationId = req.params.id;
        const userId = req.userId;
        const getLocationQuery = 'SELECT * FROM location WHERE id = ? AND user_id = ?';
        const [location] = await db.execute(getLocationQuery, [locationId, userId]);

        if (location.length === 0) {
            return res.status(404).json({ error: 'Location not found' });
        }

        res.json(location[0]);
    } catch (error) {
      console.error('Error getting location:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Update location
exports.updateLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const { name, latitude, longitude } = req.body;
        const userId = req.userId;

        if (!name || !latitude || !longitude) {
            return res.status(400).json({ error: 'Invalid input', message: 'Please provide name, latitude, and longitude' });
        }

        const updateLocationQuery = 'UPDATE location SET name = ?, coordinates = POINT(?, ?) WHERE id = ? AND user_id = ?';
        await db.execute(updateLocationQuery, [name, latitude, longitude, locationId, userId]);

        res.json({ message: 'Location updated successfully' });
    } catch (error) {
      console.error('Error updating location:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};

// Delete location
exports.deleteLocation = async (req, res) => {
    try {
        const locationId = req.params.id;
        const userId = req.userId;

        const deleteLocationQuery = 'DELETE FROM location WHERE id = ? AND user_id = ?';
        await db.execute(deleteLocationQuery, [locationId, userId]);

        res.json({ message: 'Location deleted successfully' });
    } catch (error) {
      console.error('Error deleting location:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
};
