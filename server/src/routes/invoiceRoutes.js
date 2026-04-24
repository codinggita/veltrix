const express = require('express');
const router = express.Router();
const { 
  getInvoices, 
  getInvoice, 
  createInvoice, 
  updateStatus, 
  deleteInvoice 
} = require('../controllers/invoiceController');
const protect = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getInvoices)
  .post(createInvoice);

router.route('/:id')
  .get(getInvoice)
  .delete(deleteInvoice);

router.patch('/:id/status', updateStatus);

module.exports = router;
