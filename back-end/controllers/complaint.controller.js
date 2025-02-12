const express = require('express');

const {
    createComplaint,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    changeComplaintStatus,
    getComplaintsByUser,
    getAllComplaints
} = require("./../services/complaint.service");
const router = express.Router();

// Create a new complaint
router.post('/', async (req, res) => {
    try {
        const result = await createComplaint(req.body);
        if (result.success) {
            res.status(201).json(result.message);
        } else {
            res.status(400).json({ message: result.message });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get a complaint by ID
router.get('/:id', async (req, res) => {
    try {
        const result = await getComplaintById(req.params.id);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});
// Update a complaint
router.put('/:id', async (req, res) => {
    try {
        const result = await updateComplaint(req.params.id, req.body);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Delete a complaint
router.delete('/:id', async (req, res) => {
    try {
        const result = await deleteComplaint(req.params.id);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json({ message: result.message });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Change complaint status
router.put('/status/:id', async (req, res) => {
    try {
        console.log(req.params.id);
        console.log(req.body.status)
        const result = await changeComplaintStatus(req.params.id, req.body.status);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get complaints by user
router.get('/user/:userId', async (req, res) => {
    try {
        const result = await getComplaintsByUser(req.params.userId);
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Get all complaints
router.get('/', async (req, res) => {
    try {
        const result = await getAllComplaints();
        if (!result.success) {
            return res.status(404).json({ message: result.message });
        }
        res.status(200).json(result.message);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
