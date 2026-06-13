const mongoose = require('mongoose');

const seatSchema = new mongoose.Schema({
  seatNumber: { type: Number, required: true },
  isBooked:   { type: Boolean, default: false },
  passenger:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
  booking:    { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', default: null },
});

const tripSchema = new mongoose.Schema(
  {
    route:    { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
    driver:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    vehicle:  { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
    departureTime: { type: Date, required: true },
    arrivalTime:   { type: Date, required: true }, // set by controller
    price:    { type: Number, required: true },
    seats:    [seatSchema],
    status: {
      type: String,
      enum: ['scheduled', 'boarding', 'in-transit', 'completed', 'cancelled'],
      default: 'scheduled',
    },
    availableSeats: { type: Number },
    setByController: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    notes: { type: String },
  },
  { timestamps: true }
);

// Auto-generate seats based on vehicle capacity before save
tripSchema.pre('save', async function (next) {
  if (this.isNew && this.seats.length === 0) {
    const Vehicle = require('./Vehicle');
    const vehicle = await Vehicle.findById(this.vehicle);
    if (vehicle) {
      this.seats = Array.from({ length: vehicle.capacity }, (_, i) => ({
        seatNumber: i + 1,
        isBooked: false,
      }));
      this.availableSeats = vehicle.capacity;
    }
  }
  next();
});

module.exports = mongoose.model('Trip', tripSchema);
