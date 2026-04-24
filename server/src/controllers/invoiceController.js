const Invoice = require('../models/Invoice');
const Client = require('../models/Client');

// @desc    Get all invoices for user
// @route   GET /api/invoices
// @access  Private
exports.getInvoices = async (req, res) => {
  try {
    const invoices = await Invoice.find({ user: req.user._id })
      .populate('client', 'name email businessName')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: invoices.length, data: invoices });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get single invoice
// @route   GET /api/invoices/:id
// @access  Private
exports.getInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOne({ _id: req.params.id, user: req.user._id })
      .populate('client', 'name email businessName address');

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Create new invoice
// @route   POST /api/invoices
// @access  Private
exports.createInvoice = async (req, res) => {
  try {
    const { client, invoiceNumber, dueDate, items, tax, notes, currency } = req.body;

    // Verify client belongs to user
    const clientExists = await Client.findOne({ _id: client, user: req.user._id });
    if (!clientExists) {
      return res.status(404).json({ success: false, message: 'Client not found or unauthorized' });
    }

    // Check if invoice number exists
    const existing = await Invoice.findOne({ invoiceNumber, user: req.user._id });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Invoice number already exists for your account' });
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

    res.status(201).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Update invoice status
// @route   PATCH /api/invoices/:id/status
// @access  Private
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const invoice = await Invoice.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status },
      { new: true, runValidators: true }
    );

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, data: invoice });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Delete invoice
// @route   DELETE /api/invoices/:id
// @access  Private
exports.deleteInvoice = async (req, res) => {
  try {
    const invoice = await Invoice.findOneAndDelete({ _id: req.params.id, user: req.user._id });

    if (!invoice) {
      return res.status(404).json({ success: false, message: 'Invoice not found' });
    }

    res.status(200).json({ success: true, message: 'Invoice deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
