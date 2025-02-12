const Complaint = require("../models/complaint.model");

const getAllComplaints = async () => {
    try {
        const complaints = await Complaint.find();
        return complaints;
    } catch (error) {
        throw new Error('Error fetching complaints: ' + error.message);
    }
};

const createComplaint = async (complaintData) => {
    try {
        const complaint = await Complaint.create(complaintData);
        return complaint;
    } catch (error) {
        throw new Error('Error creating complaint: ' + error.message);
    }
};

const getComplaintById = async (id) => {
    try {
        const complaint = await Complaint.findById(id);
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        return complaint;
    } catch (error) {
        throw new Error('Error fetching complaint: ' + error.message);
    }
};

const updateComplaint = async (id, updateData) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(id, updateData, { new: true });
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        return complaint;
    } catch (error) {
        throw new Error('Error updating complaint: ' + error.message);
    }
};

const deleteComplaint = async (id) => {
    try {
        const complaint = await Complaint.findByIdAndDelete(id);
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        return complaint;
    } catch (error) {
        throw new Error('Error deleting complaint: ' + error.message);
    }
};


const changeComplaintStatus = async (id, status) => {
    try {
        const complaint = await Complaint.findByIdAndUpdate(id, { status: status }, { new: true });
        if (!complaint) {
            throw new Error('Complaint not found');
        }
        return complaint;
    } catch (error) {
        throw new Error('Error changing complaint status: ' + error.message);
    }
};

async function getComplaintsByUser(userId) {
    try {
        const complaints = await Complaint.find({ user: userId }).populate('user'); 
        return complaints;
    } catch (err) {
        throw new Error('Error fetching complaints: ' + err.message);
    }
}




module.exports = {
    getAllComplaints,
    createComplaint,
    getComplaintById,
    updateComplaint,
    deleteComplaint,
    changeComplaintStatus,
    getComplaintsByUser
};