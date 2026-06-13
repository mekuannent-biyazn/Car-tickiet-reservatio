const express = require('express');
const router  = express.Router();
const {
  searchTrips, getTrips, getTrip, createTrip,
  scheduleTrip, getMyTrips, updateTripStatus,
} = require('../controllers/tripController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.get('/search',    searchTrips);
router.get('/my-trips',  protect, authorize('driver'), getMyTrips);
router.get('/',          protect, authorize('controller'), getTrips);
router.get('/:id',       getTrip);
router.post('/',         protect, authorize('driver'), createTrip);
router.put('/:id/schedule', protect, authorize('controller'), scheduleTrip);
router.put('/:id/status',   protect, authorize('driver', 'controller'), updateTripStatus);

module.exports = router;
