const User    = require('../models/User');
const Trip    = require('../models/Trip');
const Booking = require('../models/Booking');

// @desc  Get all drivers (controller)
// @route GET /api/drivers
const getAllDrivers = async (req, res) => {
  try {
    const drivers = await User.find({ role: 'driver' }).select('-password');
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get driver dashboard stats
// @route GET /api/drivers/stats
const getDriverStats = async (req, res) => {
  try {
    const trips = await Trip.find({ driver: req.user._id });
    const tripIds = trips.map((t) => t._id);
    const bookings = await Booking.find({ trip: { $in: tripIds }, status: { $ne: 'cancelled' } });

    const totalRevenue = bookings.reduce((acc, b) => acc + b.totalPrice, 0);

    res.json({
      totalTrips:      trips.length,
      scheduledTrips:  trips.filter((t) => t.status === 'scheduled').length,
      completedTrips:  trips.filter((t) => t.status === 'completed').length,
      totalPassengers: bookings.reduce((acc, b) => acc + b.totalSeats, 0),
      totalRevenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Activate / deactivate driver (controller)
// @route PUT /api/drivers/:id/status
const updateDriverStatus = async (req, res) => {
  try {
    const { isActive } = req.body;
    const driver = await User.findOneAndUpdate(
      { _id: req.params.id, role: 'driver' },
      { isActive },
      { new: true }
    ).select('-password');

    if (!driver) return res.status(404).json({ message: 'Driver not found' });
    res.json({ message: `Driver ${isActive ? 'activated' : 'deactivated'}`, driver });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAllDrivers, getDriverStats, updateDriverStatus };
