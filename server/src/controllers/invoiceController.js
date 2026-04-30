const Invoice = require('../models/Invoice');
const Client = require('../models/Client');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/apiError');
const ApiResponse = require('../utils/apiResponse');

// @desc    Get all invoices for user
// @route   GET /api/v1/invoices
// @access  Private
exports.getInvoices = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  // Auto-update overdue invoices
  await Invoice.updateMany(
    { 
      user: userId, 
      status: 'sent', 
      dueDate: { $lt: new Date() } 
    },
    { status: 'overdue' }
  );

  const invoices = await Invoice.find({ user: userId })
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
  const userId = req.user._id;
  const invoice = await Invoice.findOne({ 
    _id: req.params.id, 
    user: userId 
  }).populate('client', 'name email address');

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
  const userId = req.user._id;

  // Verify client belongs to user
  const clientExists = await Client.findOne({ 
    _id: client, 
    userId: userId 
  });
  
  if (!clientExists) {
    throw new ApiError(404, "Client not found or unauthorized");
  }

  // Check if invoice number exists
  const existing = await Invoice.findOne({ 
    invoiceNumber, 
    user: userId 
  });
  
  if (existing) {
    throw new ApiError(400, "Invoice number already exists for your account");
  }

  const invoice = await Invoice.create({
    user: userId,
    client,
    invoiceNumber,
    dueDate,
    items,
    tax,
    notes,
    currency
  });

  await Notification.create({
    user: userId,
    title: 'Invoice Generated',
    message: `Invoice #${invoiceNumber} has been successfully generated for ${clientExists.name}.`,
    type: 'success',
    link: `/app/invoices/edit/${invoice._id}`
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
  const userId = req.user._id;
  
  const invoice = await Invoice.findOneAndUpdate(
    { _id: req.params.id, user: userId },
    { status },
    { returnDocument: 'after', runValidators: true }
  );

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, invoice, "Invoice status updated successfully")
  );
});

// @desc    Update invoice
// @route   PUT /api/v1/invoices/:id
// @access  Private
exports.updateInvoice = asyncHandler(async (req, res) => {
  const { client, invoiceNumber, dueDate, items, tax, notes, currency, status } = req.body;
  const userId = req.user._id;

  const invoice = await Invoice.findOne({ 
    _id: req.params.id, 
    user: userId 
  });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  // If client changed, verify new client
  if (client && client !== invoice.client.toString()) {
    const clientExists = await Client.findOne({ _id: client, userId });
    if (!clientExists) throw new ApiError(404, "New client not found");
  }

  // Update fields
  const updated = await Invoice.findByIdAndUpdate(
    req.params.id,
    { client, invoiceNumber, dueDate, items, tax, notes, currency, status },
    { returnDocument: 'after', runValidators: true }
  );

  if (invoice.status !== status) {
    await Notification.create({
      user: userId,
      title: 'Invoice Status Updated',
      message: `Invoice #${invoiceNumber} is now marked as ${status.toUpperCase()}.`,
      type: status === 'paid' ? 'success' : status === 'overdue' ? 'error' : 'info',
      link: `/app/invoices/edit/${updated._id}`
    });
  }

  return res.status(200).json(
    new ApiResponse(200, updated, "Invoice updated successfully")
  );
});

// @desc    Delete invoice
// @route   DELETE /api/v1/invoices/:id
// @access  Private
exports.deleteInvoice = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const invoice = await Invoice.findOneAndDelete({ 
    _id: req.params.id, 
    user: userId 
  });

  if (!invoice) {
    throw new ApiError(404, "Invoice not found");
  }

  return res.status(200).json(
    new ApiResponse(200, {}, "Invoice deleted successfully")
  );
});
