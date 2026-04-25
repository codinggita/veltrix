const Payment = require('../models/Payment');
const Invoice = require('../models/Invoice');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all payments for user
// @route   GET /api/v1/payments
// @access  Private
exports.getPayments = asyncHandler(async (req, res) => {
  const payments = await Payment.find({ user: req.user._id })
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

  const stats = await Payment.aggregate([
    { $match: { user: userId } },
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

  // Fix 15: Improved transaction ID generation
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

  // If payment is "Paid" and linked to an invoice, update invoice status
  if (status === 'Paid' && invoice) {
    await Invoice.findByIdAndUpdate(invoice, { status: 'paid' });
  }

  return res.status(201).json(
    new ApiResponse(201, payment, "Payment recorded successfully")
  );
});
