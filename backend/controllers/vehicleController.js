const Vehicle = require('../models/Vehicle');

// @desc  Register vehicle (driver)
// @route POST /api/vehicles
const registerVehicle = async (req, res) => {
  try {
    const { plateNumber, vehicleType, capacity, model, color, year } = req.body;
    const exists = await Vehicle.findOne({ plateNumber: plateNumber.toUpperCase() });
    if (exists) return res.status(400).json({ message: 'Vehicle with this plate already registered' });

    const vehicle = await Vehicle.create({
      driver: req.user._id,
      plateNumber,
      vehicleType,
      capacity,
      model,
      color,
      year,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get driver's own vehicles
// @route GET /api/vehicles/my-vehicles
const getMyVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find({ driver: req.user._id });
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get all vehicles (controller)
// @route GET /api/vehicles
const getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find().populate('driver', 'firstName lastName email phone');
    res.json(vehicles);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Approve / reject vehicle (controller)
// @route PUT /api/vehicles/:id/approve
const approveVehicle = async (req, res) => {
  try {
    const { isApproved } = req.body;
    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { isApproved },
      { new: true }
    ).populate('driver', 'firstName lastName');

    if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
    res.json({ message: `Vehicle ${isApproved ? 'approved' : 'rejected'}`, vehicle });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerVehicle, getMyVehicles, getAllVehicles, approveVehicle };
