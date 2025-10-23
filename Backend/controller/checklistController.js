const Checklist=require("../models/checklist")
const User = require('../models/Users');
exports.createChecklist = async (req, res) => {
  try {
    
    const { name, sections } = req.body;
    const user = req.user
    if (!user || user.role !== 'procurement_manager') {
      return res.status(403).json({ message: 'Only procurement manager can create checklist' });
    }

    const lastChecklist = await Checklist.findOne().sort({ id: -1 });
    const newId = lastChecklist ? lastChecklist.id + 1 : 1;

    const checklist = new Checklist({
      id: newId,
      name,
      createdBy:user.id,
      sections
    });

    await checklist.save();
    res.json({ message: 'Checklist created successfully', checklist });

  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

exports.getAllChecklists = async (req, res) => {
  try {
    const checklists = await Checklist.find();
    res.json(checklists);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};
exports.getChecklistById = async (req, res) => {
  try {
    const checklist = await Checklist.findOne({ id: parseInt(req.params.id) });
    if (!checklist) return res.status(404).json({ message: 'Checklist not found' });

    res.json(checklist);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};