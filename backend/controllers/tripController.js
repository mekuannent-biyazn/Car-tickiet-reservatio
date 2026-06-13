const Trip    = require('../models/Trip');
const Vehicle = require('../models/Vehicle');

// @desc  Search available trips
// @route GET /api/trips/search?origin=&destination=&date=
const searchTrips = async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    if (!origin || !destination) {
      return res.status(400).json({ message: 'Origin and destination are required' });
    }

    // Build date range if provided
    let dateFilter = {};
    if (date) {
      const start = new Date(date);
      start.setHours(0, 0, 0, 0);
      const end = new Date(date);
      end.setHours(23, 59, 59, 999);
      dateFilter = { departureTime: { $gte: start, $lte: end } };
    } else {
      dateFilter = { departureTime: { $gte: new Date() } };
    }

    const trips = await Trip.find({
      status: { $in: ['scheduled', 'boarding'] },
      availableSeats: { $gt: 0 },
      ...dateFilter,
    })
      .populate({
        path: 'route',
        match: {
          origin:      new RegExp(origin, 'i'),
          destination: new RegExp(destination, 'i'),
        },
      })
      .populate('vehicle', 'vehicleType plateNumber model color capacity')
      .populate('driver', 'firstName lastName phone')
      .sort({ departureTime: 1 });

    // Filter out trips where route didn't match
    const filtered = trips.filter((t) => t.route !== null);
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all trips
// @route GET /api/trips
const getTrips = async (req, res) => {
  try {
    const trips = await Trip.find()
      .populate('route')
      .populate('vehicle', 'vehicleType plateNumber model capacity')
      .populate('driver', 'firstName lastName phone')
      .sort({ departureTime: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single trip with seat map
// @route GET /api/trips/:id
const getTrip = async (req, res) => {
  try {
    const trip = await Trip.findById(req.params.id)
      .populate('route')
      .populate('vehicle')
      .populate('driver', 'firstName lastName phone');
    if (!trip) return res.status(404).json({ message: 'Trip not found' });
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create trip (driver submits, controller approves time)
// @route POST /api/trips
const createTrip = async (req, res) => {
  try {
    const { route, vehicle, departureTime, price, notes } = req.body;

    // Make sure vehicle belongs to this driver
    const veh = await Vehicle.findOne({ _id: vehicle, driver: req.user._id, isApproved: true });
    if (!veh) {
      return res.status(400).json({ message: 'Vehicle not found or not approved' });
    }

    // arrivalTime will be set by controller later; placeholder same as departure
    const trip = await Trip.create({
      route,
      driver: req.user._id,
      vehicle,
      departureTime,
      arrivalTime: departureTime,
      price,
      notes,
    });

    await trip.populate(['route', 'vehicle', 'driver']);
    res.status(201).json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Controller sets arrival time / approves schedule
// @route PUT /api/trips/:id/schedule
const scheduleTrip = async (req, res) => {
  try {
    const { arrivalTime, price, status, notes } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    if (arrivalTime) trip.arrivalTime     = arrivalTime;
    if (price)       trip.price           = price;
    if (status)      trip.status          = status;
    if (notes)       trip.notes           = notes;
    trip.setByController = req.user._id;

    await trip.save();
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Driver's own trips
// @route GET /api/trips/my-trips
const getMyTrips = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.user._id })
      .populate('route')
      .populate('vehicle', 'vehicleType plateNumber')
      .sort({ departureTime: -1 });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update trip status
// @route PUT /api/trips/:id/status
const updateTripStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const trip = await Trip.findById(req.params.id);
    if (!trip) return res.status(404).json({ message: 'Trip not found' });

    // Driver can only update their own trips
    if (req.user.role === 'driver' && trip.driver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    trip.status = status;
    await trip.save();
    res.json({ message: 'Status updated', trip });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { searchTrips, getTrips, getTrip, createTrip, scheduleTrip, getMyTrips, updateTripStatus };
