const express = require('express');
const router  = express.Router();
const { getRoutes, getRoute, createRoute, updateRoute, deleteRoute } = require('../controllers/routeController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/',     getRoutes);
router.get('/:id',  getRoute);
router.post('/',    protect, authorize('controller'), createRoute);
router.put('/:id',  protect, authorize('controller'), updateRoute);
router.delete('/:id', protect, authorize('controller'), deleteRoute);

module.exports = router;
