const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const invoiceRoutes = require('./invoiceRoutes');

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/invoices', invoiceRoutes);

module.exports = router;
