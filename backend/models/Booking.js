const mongoose = require('mongoose');

const passengerDetailSchema = new mongoose.Schema({
  firstName:  { type: String, required: true },
  lastName:   { type: String, required: true },
  idNumber:   { type: String },
  age:        { type: Number },
  seatNumber: { type: Number, required: true },
});

const bookingSchema = new mongoose.Schema(
  {
    passenger:  { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    trip:       { type: mongoose.Schema.Types.ObjectId, ref: 'Trip', required: true },
    passengers: [passengerDetailSchema],
    totalSeats: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    bookingCode: { type: String, unique: true },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'cancelled', 'completed'],
      default: 'confirmed',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    paymentMethod: {
      type: String,
      enum: ['cash', 'mobile_money', 'bank_transfer', 'online'],
      default: 'cash',
    },
  },
  { timestamps: true }
);

// Generate unique booking code
bookingSchema.pre('save', function (next) {
  if (!this.bookingCode) {
    const ts   = Date.now().toString(36).toUpperCase();
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    this.bookingCode = `TKT-${ts}-${rand}`;
  }
  next();
});

module.exports = mongoose.model('Booking', bookingSchema);
