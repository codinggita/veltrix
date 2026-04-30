const mongoose = require('mongoose');

const invoiceItemSchema = new mongoose.Schema({
  description: { type: String, required: true },
  quantity: { type: Number, required: true, default: 1 },
  unitPrice: { type: Number, required: true },
  amount: { type: Number }
});

const invoiceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  client: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Client',
    required: true
  },
  invoiceNumber: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['draft', 'sent', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  issueDate: {
    type: Date,
    default: Date.now
  },
  dueDate: {
    type: Date,
    required: true
  },
  items: [invoiceItemSchema],
  subtotal: {
    type: Number,
    required: true,
    default: 0
  },
  tax: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    default: 0
  },
  currency: {
    type: String,
    default: 'INR'
  },
  notes: {
    type: String
  },
  paymentTerms: {
    type: String
  }
}, {
  timestamps: true
});

// Auto-calculate subtotal and total before validation
invoiceSchema.pre('validate', async function() {
  // 1. Calculate individual item amounts
  if (this.items && this.items.length > 0) {
    this.items.forEach(item => {
      item.amount = (item.quantity || 1) * (item.unitPrice || 0);
    });

    // 2. Calculate subtotal from item amounts
    this.subtotal = this.items.reduce((acc, item) => acc + item.amount, 0);
  }

  // 3. Calculate total
  this.total = (this.subtotal || 0) + (Number(this.tax) || 0);
});

invoiceSchema.index({ invoiceNumber: 1, user: 1 }, { unique: true });

module.exports = mongoose.model('Invoice', invoiceSchema);
