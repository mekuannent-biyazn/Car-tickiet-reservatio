const express = require('express');
const router  = express.Router();
const { registerVehicle, getMyVehicles, getAllVehicles, approveVehicle } = require('../controllers/vehicleController');
const { protect, authorize } = require('../middleware/authMiddleware');

router.post('/',              protect, authorize('driver'), registerVehicle);
router.get('/my-vehicles',    protect, authorize('driver'), getMyVehicles);
router.get('/',               protect, authorize('controller'), getAllVehicles);
router.put('/:id/approve',    protect, authorize('controller'), approveVehicle);

module.exports = router;
