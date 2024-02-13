const db = require('C:/node/P3 - Villanueva/database');

//Add new freqlocation
exports.addFreq = async (req, res) => {
    try {
      const { category, name, address, loc_id } = req.body;
      const userId = req.userId; 
  
      const addFreqLocationQuery = 'INSERT INTO freqLocation (category, name, address, user_id, loc_id) VALUES (?, ?, ?, ?, ?)';
      await db.promise().execute(addFreqLocationQuery, [category, name, address, userId, loc_id]);
  
      res.status(201).json({ message: 'FreqLocation added successfully' });
    } catch (error) {
      console.error('Error adding freqLocation:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//Get all freqlocations
exports.allFreq = async (req, res) => {
    try {
      const userId = req.userId;
  
      const getAllFreqLocationsQuery = 'SELECT * FROM freqLocation WHERE user_id = ?';
      const [freqLocations] = await db.promise().execute(getAllFreqLocationsQuery, [userId]);
  
      res.json(freqLocations);
    } catch (error) {
      console.error('Error getting freqLocations:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//Get freqlocation by id
exports.getFreq = async (req, res) => {
    try {
      const userId = req.userId;
      const freqLocationId = req.params.id;
  
      const getFreqLocationQuery = 'SELECT * FROM freqLocation WHERE id = ? AND user_id = ?';
      const [freqLocation] = await db.promise().execute(getFreqLocationQuery, [freqLocationId, userId]);
  
      if (freqLocation.length === 0) {
        return res.status(404).json({ error: 'FreqLocation not found' });
      }
  
      res.json(freqLocation[0]);
    } catch (error) {
      console.error('Error getting freqLocation by id:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//Update freqlocation
exports.updateFreq = async (req, res) => {
    try {
      const { category, name, address, loc_id } = req.body;
      const userId = req.userId;
      const freqLocationId = req.params.id;
  
      const updateFreqLocationQuery = 'UPDATE freqLocation SET category = ?, name = ?, address = ?, loc_id = ? WHERE id = ? AND user_id = ?';
      const [result] = await db.promise().execute(updateFreqLocationQuery, [category, name, address, loc_id, freqLocationId, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'FreqLocation not found or unauthorized' });
      }
  
      res.json({ message: 'FreqLocation updated successfully' });
    } catch (error) {
      console.error('Error updating freqLocation:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };

//Delete freq location
exports.deleteFreq = async (req, res) => {
    try {
      const userId = req.userId;
      const freqLocationId = req.params.id;
  
      const deleteFreqLocationQuery = 'DELETE FROM freqLocation WHERE id = ? AND user_id = ?';
      const [result] = await db.promise().execute(deleteFreqLocationQuery, [freqLocationId, userId]);
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: 'FreqLocation not found or unauthorized' });
      }
  
      res.json({ message: 'FreqLocation deleted successfully' });
    } catch (error) {
      console.error('Error deleting freqLocation:', error.message);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  };