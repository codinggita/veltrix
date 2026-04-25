const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
    validate: {
      validator: function(v) {
        // Only validate if password is being set or modified
        if (!this.isModified('password')) return true;
        return /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(v);
      },
      message: "Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, and one number"
    }
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
