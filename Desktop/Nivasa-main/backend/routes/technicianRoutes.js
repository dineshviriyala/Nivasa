const express = require('express');
const router = express.Router();
const Technician = require('../models/Technician');

// GET all technicians for a specific apartment
router.get('/all-technicians', async (req, res) => {
    try {
        const { apartmentCode } = req.query;
        
        console.log('🔍 GET /all-technicians called');
        console.log('📦 Query params:', req.query);
        console.log('🏢 apartmentCode:', apartmentCode);
        
        if (!apartmentCode) {
            console.log('❌ Missing apartmentCode');
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        console.log('🔍 Searching for technicians with apartmentCode:', apartmentCode);
        const technicians = await Technician.find({ apartmentCode }).sort({ createdAt: -1 });
        console.log('✅ Found technicians:', technicians.length);
        console.log('📦 Technicians data:', technicians);
        
        res.status(200).json(technicians);
    } catch (error) {
        console.error('❌ Error fetching technicians:', error);
        res.status(500).json({ error: 'Failed to fetch technicians' });
    }
});

// GET technician by ID (apartment-specific)
router.get('/technicians/:id', async (req, res) => {
    try {
        const { apartmentCode } = req.query;
        
        if (!apartmentCode) {
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        const technician = await Technician.findOne({ 
            _id: req.params.id, 
            apartmentCode 
        });
        
        if (!technician) {
            return res.status(404).json({ error: 'Technician not found' });
        }
        res.status(200).json(technician);
    } catch (error) {
        console.error('Error fetching technician:', error);
        res.status(500).json({ error: 'Failed to fetch technician' });
    }
});

// POST add new technician (apartment-specific)
router.post('/add-technicians', async (req, res) => {
    try {
        const { name, email, phone, specialty, status, apartmentCode } = req.body;

        console.log('Received technician data:', { name, email, phone, specialty, status, apartmentCode });

        // Validation
        if (!name || !email || !phone || !specialty || !apartmentCode) {
            console.log('Validation failed: Missing required fields');
            return res.status(400).json({ error: 'Name, email, phone, specialty, and apartment code are required' });
        }

        // Check if email already exists for this apartment
        const existingTechnician = await Technician.findOne({ email, apartmentCode });
        if (existingTechnician) {
            console.log('Validation failed: Email already exists for this apartment');
            return res.status(400).json({ error: 'Technician with this email already exists in this apartment' });
        }

        // Create new technician
        const technician = new Technician({
            name,
            email,
            phone,
            specialty,
            status: status || 'available',
            apartmentCode
        });

        console.log('Saving technician to database...');
        await technician.save();
        console.log('Technician saved successfully:', technician._id);

        res.status(201).json(technician);
    } catch (error) {
        console.error('Error adding technician:', error);
        if (error.name === 'ValidationError') {
            console.log('Validation error details:', error.message);
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to add technician' });
    }
});

// PATCH update technician status (apartment-specific)
router.patch('/technicians/:id/status', async (req, res) => {
    try {
        const { status, apartmentCode } = req.body;

        if (!status || !['available', 'busy', 'offline'].includes(status)) {
            return res.status(400).json({ error: 'Valid status is required (available, busy, offline)' });
        }

        if (!apartmentCode) {
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        const updatedTechnician = await Technician.findOneAndUpdate(
            { _id: req.params.id, apartmentCode },
            { status },
            { new: true, runValidators: true }
        );

        if (!updatedTechnician) {
            return res.status(404).json({ error: 'Technician not found' });
        }

        res.status(200).json(updatedTechnician);
    } catch (error) {
        console.error('Error updating technician status:', error);
        res.status(500).json({ error: 'Failed to update technician status' });
    }
});

// PUT update technician (apartment-specific)
router.put('/technicians/:id', async (req, res) => {
    try {
        const { name, email, phone, specialty, status, apartmentCode } = req.body;

        if (!apartmentCode) {
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        // Check if email already exists for different technician in same apartment
        if (email) {
            const existingTechnician = await Technician.findOne({
                email,
                apartmentCode,
                _id: { $ne: req.params.id }
            });
            if (existingTechnician) {
                return res.status(400).json({ error: 'Technician with this email already exists in this apartment' });
            }
        }

        const updatedTechnician = await Technician.findOneAndUpdate(
            { _id: req.params.id, apartmentCode },
            { name, email, phone, specialty, status },
            { new: true, runValidators: true }
        );

        if (!updatedTechnician) {
            return res.status(404).json({ error: 'Technician not found' });
        }

        res.status(200).json(updatedTechnician);
    } catch (error) {
        console.error('Error updating technician:', error);
        if (error.name === 'ValidationError') {
            return res.status(400).json({ error: error.message });
        }
        res.status(500).json({ error: 'Failed to update technician' });
    }
});

// DELETE technician (apartment-specific)
router.delete('/technicians/:id', async (req, res) => {
    try {
        const { apartmentCode } = req.query;
        
        if (!apartmentCode) {
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        const technician = await Technician.findOneAndDelete({ 
            _id: req.params.id, 
            apartmentCode 
        });

        if (!technician) {
            return res.status(404).json({ error: 'Technician not found' });
        }

        res.status(200).json({
            message: 'Technician deleted successfully',
            deletedTechnician: technician
        });
    } catch (error) {
        console.error('Error deleting technician:', error);
        res.status(500).json({ error: 'Failed to delete technician' });
    }
});

// GET technicians by specialty (apartment-specific)
router.get('/technicians/specialty/:specialty', async (req, res) => {
    try {
        const { specialty } = req.params;
        const { apartmentCode } = req.query;
        
        if (!apartmentCode) {
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        const technicians = await Technician.find({
            specialty: { $regex: specialty, $options: 'i' },
            apartmentCode
        }).sort({ createdAt: -1 });

        res.status(200).json(technicians);
    } catch (error) {
        console.error('Error fetching technicians by specialty:', error);
        res.status(500).json({ error: 'Failed to fetch technicians' });
    }
});

// GET available technicians (apartment-specific)
router.get('/technicians/status/available', async (req, res) => {
    try {
        const { apartmentCode } = req.query;
        
        if (!apartmentCode) {
            return res.status(400).json({ error: 'Apartment code is required' });
        }

        const technicians = await Technician.find({ 
            status: 'available', 
            apartmentCode 
        }).sort({ createdAt: -1 });
        res.status(200).json(technicians);
    } catch (error) {
        console.error('Error fetching available technicians:', error);
        res.status(500).json({ error: 'Failed to fetch available technicians' });
    }
});

module.exports = router; 
