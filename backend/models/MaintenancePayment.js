const mongoose = require('mongoose');

const maintenancePaymentSchema = new mongoose.Schema({
  apartmentCode: {
    type: String,
    required: true
  },
  flatNumber: {
    type: String,
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  transactionId: {
    type: String,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  months: {
    type: [String],
    required: true
  }
}, { timestamps: true });

module.exports = mongoose.model('MaintenancePayment', maintenancePaymentSchema); 