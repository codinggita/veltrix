const express = require('express');
const router = express.Router();
const { 
  getFinancialInsights, 
  getGrowthVelocity 
} = require('../controllers/analyticsController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.get('/insights', getFinancialInsights);
router.get('/velocity', getGrowthVelocity);

module.exports = router;
