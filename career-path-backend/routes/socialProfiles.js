const express = require('express');
const router = express.Router();
const SocialProfile = require('../models/SocialProfiles');
const { protect } = require('../middleware/authMiddleware');

// Get user's social profiles
router.get('/', protect, async (req, res) => {
  try {
    const socialProfile = await SocialProfile.findOne({ userId: req.user._id });
    
    if (socialProfile) {
      res.json(socialProfile.links);
    } else {
      res.json([]); // Return empty array if no profiles found
    }
  } catch (error) {
    console.error('Error fetching social profiles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Create or update social profiles
router.post('/', protect, async (req, res) => {
  try {
    const { links } = req.body;
    
    // Validate
    if (!Array.isArray(links)) {
      return res.status(400).json({ message: 'Links must be an array' });
    }
    
    // Find existing profile or create new one
    let socialProfile = await SocialProfile.findOne({ userId: req.user._id });
    
    if (socialProfile) {
      // Update existing profile
      socialProfile.links = links;
      await socialProfile.save();
    } else {
      // Create new profile
      socialProfile = new SocialProfile({
        userId: req.user._id,
        links: links
      });
      await socialProfile.save();
    }
    
    res.status(200).json({ message: 'Social profiles updated successfully', links });
  } catch (error) {
    console.error('Error saving social profiles:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
