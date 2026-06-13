const Route = require('../models/Route');

// @desc  Get all active routes
// @route GET /api/routes
const getRoutes = async (req, res) => {
  try {
    const { origin, destination } = req.query;
    const filter = { isActive: true };
    if (origin)      filter.origin      = new RegExp(origin, 'i');
    if (destination) filter.destination = new RegExp(destination, 'i');

    const routes = await Route.find(filter).populate('createdBy', 'firstName lastName');
    res.json(routes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Get single route
// @route GET /api/routes/:id
const getRoute = async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Create route (controller only)
// @route POST /api/routes
const createRoute = async (req, res) => {
  try {
    const { origin, destination, distance, estimatedDuration, basePrice, stops } = req.body;
    const route = await Route.create({
      origin,
      destination,
      distance,
      estimatedDuration,
      basePrice,
      stops,
      createdBy: req.user._id,
    });
    res.status(201).json(route);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Route between these locations already exists' });
    }
    res.status(500).json({ message: err.message });
  }
};

// @desc  Update route
// @route PUT /api/routes/:id
const updateRoute = async (req, res) => {
  try {
    const route = await Route.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.json(route);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// @desc  Delete route
// @route DELETE /api/routes/:id
const deleteRoute = async (req, res) => {
  try {
    await Route.findByIdAndUpdate(req.params.id, { isActive: false });
    res.json({ message: 'Route deactivated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getRoutes, getRoute, createRoute, updateRoute, deleteRoute };
