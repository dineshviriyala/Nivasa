const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },
    priority: { type: String, required: true },
    phoneNumber: { type: String, required: true },
    additionalInfo: { type: String },
    status: { type: String, default: 'Open' },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
    apartment: { type: mongoose.Schema.Types.ObjectId, ref: 'Apartment', required: false },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Complaint', ComplaintSchema);
