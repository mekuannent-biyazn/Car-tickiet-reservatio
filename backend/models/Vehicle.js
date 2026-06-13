const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema(
  {
    driver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    plateNumber: { type: String, required: true, unique: true, uppercase: true },
    vehicleType: {
      type: String,
      enum: ['bus', 'minibus', 'taxi', 'minivan', 'coach', 'shuttle'],
      required: true,
    },
    capacity: { type: Number, required: true },
    model:    { type: String, required: true },
    color:    { type: String, required: true },
    year:     { type: Number, required: true },
    isApproved: { type: Boolean, default: false },
    isActive:   { type: Boolean, default: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Vehicle', vehicleSchema);
