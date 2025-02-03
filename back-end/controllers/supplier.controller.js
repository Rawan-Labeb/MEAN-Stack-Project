const Supplier = require('../models/supplier.model');

const supplierController = {
    getAllSuppliers: async (req, res) => {
        try {
            const suppliers = await Supplier.find();
            console.log('Found suppliers:', suppliers); 
            res.status(200).json(suppliers);
        } catch (error) {
            console.error('Error:', error); 
            res.status(500).json({ message: error.message });
        }
    },

    getSupplierById: async (req, res) => {
        try {
            const supplier = await Supplier.findOne({ 
                _id: req.params.id,
                isActive: true 
            });
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            res.status(200).json(supplier);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    },

    createSupplier: async (req, res) => {
        try {
            const supplier = new Supplier({
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                companyName: req.body.companyName,
                contactNo: req.body.contactNo,
                isActive: true
            });
            const newSupplier = await supplier.save();
            res.status(201).json(newSupplier);
        } catch (error) {
            console.error('Create error:', error); 
            res.status(400).json({ message: error.message });
        }
    },

    updateSupplier: async (req, res) => {
        try {
            const supplier = await Supplier.findById(req.params.id);
            console.log('Found supplier:', supplier); 
            
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }

            Object.assign(supplier, req.body);
            const updatedSupplier = await supplier.save();
            console.log('Updated supplier:', updatedSupplier); 
            
            res.status(200).json(updatedSupplier);
        } catch (error) {
            console.error('Update error:', error); 
            res.status(400).json({ message: error.message });
        }
    },

    deleteSupplier: async (req, res) => {
        try {
            const supplier = await Supplier.findById(req.params.id);
            if (!supplier) {
                return res.status(404).json({ message: 'Supplier not found' });
            }
            supplier.isActive = false;
            await supplier.save();
            res.status(200).json({ message: 'Supplier deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }
};

module.exports = supplierController;