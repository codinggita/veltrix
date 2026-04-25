const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all invoices for user
// @route   GET /api/v1/invoices
// @access  Private
exports.getInvoices = asyncHandler(async (req, res) => {
  const invoices = await Invoice.find({ user: req.user._id })
    .populate('client', 'name email')
    .sort({ createdAt: -1 });

  return res.status(200).json(
    new ApiResponse(200, invoices, "Invoices fetched successfully")
  );
});

// @desc    Get single invoice
// @route   GET /api/v1/invoices/:id
// @access  Private
exports.getInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id })
    .populate('client', 'name email address');

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Invoice fetched successfully")
  );
});

// @desc    Create new invoice
// @route   POST /api/v1/invoices
// @access  Private
exports.createInvoice = asyncHandler(async (req, res) => {
  const { client, invoiceNumber, dueDate, items, tax, notes, currency } = req.body;

  // Verify client belongs to user - Fix 2: using userId for Client
  const clientExists = await Client.findOne({ _id: client, userId: req.user._id });
  if (!clientExists) {
    throw new ApiError(404, "Client not found or unauthorized");
  }

  // Check if invoice number exists
  const existing = await Invoice.findOne({ invoiceNumber, user: req.user._id });
  if (existing) {
    throw new ApiError(400, "Invoice number already exists for your account");
  }

  const invoice = await Invoice.create({
    user: req.user._id,
    client,
    invoiceNumber,
    dueDate,
    items,
    tax,
    notes,
    currency
  });

  return res.status(201).json(
    new ApiResponse(201, invoice, "Invoice created successfully")
  );
});

// @desc    Update invoice status
// @route   PATCH /api/v1/invoices/:id/status
// @access  Private
exports.updateStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, user: req.user._id },
    { status },
    { new: true, runValidators: true }
  );

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Invoice status updated successfully")
  );
});

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
// @access  Private
exports.deleteInvoice = asyncHandler(async (req, res) => {
  const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Invoice deleted successfully")
  );
});
