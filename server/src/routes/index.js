const express = require('express');
const router = express.Router();

const authRoutes = require('./authRoutes');
const clientRoutes = require('./clientRoutes');
const invoiceRoutes = require('./invoiceRoutes');

const statsRoutes = require('./statsRoutes');
const userRoutes = require('./userRoutes');
const expenseRoutes = require('./expenseRoutes');
const analyticsRoutes = require('./analyticsRoutes');

router.use('/auth', authRoutes);
router.use('/clients', clientRoutes);
router.use('/invoices', invoiceRoutes);
router.use('/stats', statsRoutes);
router.use('/users', userRoutes);
router.use('/expenses', expenseRoutes);
router.use('/analytics', analyticsRoutes);

module.exports = router;
