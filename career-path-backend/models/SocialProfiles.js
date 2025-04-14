const mongoose = require('mongoose');

const socialProfileSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  links: [{
    id: {
      type: String,
      required: true
    },
    name: {
      type: String,
      required: true
    },
    url: {
      type: String,
      required: true
    }
  }],
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the "updatedAt" field on save
socialProfileSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('SocialProfile', socialProfileSchema);
