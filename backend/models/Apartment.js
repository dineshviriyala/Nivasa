const mongoose = require('mongoose');

const apartmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  apartmentCode: { type: String, required: true, unique: true },
  maintenanceAmount: { type: Number, default: 0 },
  bankDetails: {
    accountNumber: { type: String },
    accountHolder: { type: String },
    bankName: { type: String },
    ifscCode: { type: String },
    branch: { type: String },
    upiId: { type: String }
  }
}, { timestamps: true });

module.exports = mongoose.model('Apartment', apartmentSchema);
