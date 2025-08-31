const mongoose = require('mongoose');

const technicianSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        match: [/^[0-9]{10}$/, 'Please fill a valid 10-digit phone number']
    },
    specialty: {
        type: String,
        required: true,
        enum: ['Plumbing', 'Electrical', 'HVAC', 'General Maintenance', 'Carpentry']
    },
    status: {
        type: String,
        required: true,
        enum: ['available', 'busy', 'offline'],
        default: 'available'
    },
    apartmentCode: {
        type: String,
        required: true,
        trim: true
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Technician', technicianSchema);