const express = require('express');
const router  = express.Router();
const {
  createBooking, getMyBookings, getBooking, cancelBooking, getAllBookings,
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/',              protect, authorize('passenger'), createBooking);
router.get('/my-bookings',    protect, authorize('passenger'), getMyBookings);
router.get('/',               protect, authorize('controller'), getAllBookings);
router.get('/:id',            protect, getBooking);
router.put('/:id/cancel',     protect, cancelBooking);

module.exports = router;
