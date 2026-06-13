const express = require('express');
const router  = express.Router();
const { getAllDrivers, getDriverStats, updateDriverStatus } = require('../controllers/driverController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/',           protect, authorize('controller'), getAllDrivers);
router.get('/stats',      protect, authorize('driver'), getDriverStats);
router.put('/:id/status', protect, authorize('controller'), updateDriverStatus);

module.exports = router;
