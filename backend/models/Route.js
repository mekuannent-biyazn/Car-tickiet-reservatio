const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema(
  {
    origin:      { type: String, required: true, trim: true },
    destination: { type: String, required: true, trim: true },
    distance:    { type: Number }, // in km
    estimatedDuration: { type: Number }, // in minutes, set by controller
    basePrice:   { type: Number, required: true },
    isActive:    { type: Boolean, default: true },
    stops: [{ type: String, trim: true }], // intermediate stops
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
);

// Prevent duplicate routes
routeSchema.index({ origin: 1, destination: 1 }, { unique: true });

module.exports = mongoose.model('Route', routeSchema);
