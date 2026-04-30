const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all payments for user
// @route   GET /api/v1/payments
// @access  Private
exports.getPayments = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const payments = await Payment.find({ $or: [{ user: userId }, { userId: userId }] })
    .populate('client', 'name email')
    .populate('invoice', 'invoiceNumber')
    .sort({ date: -1 });

  return res.status(200).json(
    new ApiResponse(200, payments, "Payments fetched successfully")
  );
});

// @desc    Get payment stats
// @route   GET /api/v1/payments/stats
// @access  Private
exports.getPaymentStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const userObjectId = new mongoose.Types.ObjectId(userId);

  const stats = await Payment.aggregate([
    { $match: { $or: [{ user: userObjectId }, { userId: userObjectId }] } },
    {
      $group: {
        _id: '$status',
        totalAmount: { $sum: '$amount' }
      }
    }
  ]);

  const formattedStats = {
    totalCollected: 0,
    pendingProcessing: 0,
    failedTransactions: 0
  };

  stats.forEach(stat => {
    if (stat._id === 'Paid') formattedStats.totalCollected = stat.totalAmount;
    if (stat._id === 'Pending') formattedStats.pendingProcessing = stat.totalAmount;
    if (stat._id === 'Failed') formattedStats.failedTransactions = stat.totalAmount;
  });

  return res.status(200).json(
    new ApiResponse(200, formattedStats, "Payment stats fetched successfully")
  );
});

// @desc    Create new payment
// @route   POST /api/v1/payments
// @access  Private
exports.createPayment = asyncHandler(async (req, res) => {
  const { client, invoice, amount, method, status, date, notes } = req.body;

  const transactionId = `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

  const payment = await Payment.create({
    user: req.user._id,
    client,
    invoice,
    transactionId,
    amount,
    method,
    status,
    date,
    notes
  });

  if (status === 'Paid' && invoice) {
    await Invoice.findByIdAndUpdate(invoice, { status: 'paid' });
    const inv = await Invoice.findById(invoice);
    if(inv) {
      await Notification.create({
        user: req.user._id,
        title: 'Payment Received',
        message: `Payment of ${amount} received for Invoice #${inv.invoiceNumber}.`,
        type: 'success',
        link: `/app/invoices/edit/${invoice}`
      });
    }
  } else {
    await Notification.create({
      user: req.user._id,
      title: 'Payment Logged',
      message: `A payment of ${amount} has been logged (${status}).`,
      type: 'info'
    });
  }

  return res.status(201).json(
    new ApiResponse(201, payment, "Payment recorded successfully")
  );
});
