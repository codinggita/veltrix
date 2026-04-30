const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { 
    type: String, 
    required: true, 
    minlength: 8
  },
  businessName: { type: String, required: true, trim: true },
  registrationNumber: { type: String, trim: true },
  taxId: { type: String, trim: true },
  logoUrl: { type: String },
  address: {
    street: { type: String, trim: true },
    city: { type: String, trim: true },
    zipCode: { type: String, trim: true },
    country: { type: String, trim: true },
  },
  notifications: {
    paymentReceipts: { type: Boolean, default: true },
    clientActivity: { type: Boolean, default: true },
    systemUpdates: { type: Boolean, default: true },
  },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);
