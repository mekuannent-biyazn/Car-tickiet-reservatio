const Booking = require('../models/Booking');
const Trip    = require('../models/Trip');

// @desc  Create booking
// @route POST /api/bookings
const createBooking = async (req, res) => {
  try {
    const { tripId, passengers, paymentMethod } = req.body;

    const trip = await Trip.findById(tripId);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    if (trip.status === 'cancelled') return res.status(400).json({ message: 'Trip is cancelled' });

    const requestedSeats = passengers.map((p) => p.seatNumber);

    // Check seats availability
    for (const seatNo of requestedSeats) {
      const seat = trip.seats.find((s) => s.seatNumber === seatNo);
      if (!seat)           return res.status(400).json({ message: `Seat ${seatNo} does not exist` });
      if (seat.isBooked)   return res.status(400).json({ message: `Seat ${seatNo} is already booked` });
    }

    const totalPrice = trip.price * requestedSeats.length;

    const booking = await Booking.create({
      passenger:    req.user._id,
      trip:         tripId,
      passengers,
      totalSeats:   requestedSeats.length,
      totalPrice,
      paymentMethod: paymentMethod || 'cash',
    });

    // Mark seats as booked on the trip
    for (const seatNo of requestedSeats) {
      const seat = trip.seats.find((s) => s.seatNumber === seatNo);
      seat.isBooked  = true;
      seat.passenger = req.user._id;
      seat.booking   = booking._id;
    }
    trip.availableSeats -= requestedSeats.length;
    await trip.save();

    await booking.populate([
      { path: 'trip', populate: ['route', 'vehicle', 'driver'] },
    ]);

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get my bookings (passenger)
// @route GET /api/bookings/my-bookings
const getMyBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ passenger: req.user._id })
      .populate({ path: 'trip', populate: [{ path: 'route' }, { path: 'vehicle', select: 'vehicleType plateNumber model' }] })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single booking
// @route GET /api/bookings/:id
const getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({ path: 'trip', populate: ['route', 'vehicle', 'driver'] })
      .populate('passenger', 'firstName lastName email phone');

    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    // Passenger can only see their own booking
    if (
      req.user.role === 'passenger' &&
      booking.passenger._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Cancel booking
// @route PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: 'Booking not found' });

    if (booking.passenger.toString() !== req.user._id.toString() && req.user.role !== 'controller') {
      return res.status(403).json({ message: 'Not authorized' });
    }
    if (booking.status === 'cancelled') {
      return res.status(400).json({ message: 'Booking already cancelled' });
    }

    booking.status = 'cancelled';
    await booking.save();

    // Free the seats
    const trip = await Trip.findById(booking.trip);
    if (trip) {
      for (const p of booking.passengers) {
        const seat = trip.seats.find((s) => s.seatNumber === p.seatNumber);
        if (seat) {
          seat.isBooked  = false;
          seat.passenger = null;
          seat.booking   = null;
        }
      }
      trip.availableSeats += booking.totalSeats;
      await trip.save();
    }

    res.json({ message: 'Booking cancelled successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all bookings (controller)
// @route GET /api/bookings
const getAllBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('passenger', 'firstName lastName email phone')
      .populate({ path: 'trip', populate: ['route', 'vehicle'] })
      .sort({ createdAt: -1 });
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createBooking, getMyBookings, getBooking, cancelBooking, getAllBookings };
