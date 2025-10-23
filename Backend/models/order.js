
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  clientId: { type: Number, required: true }, // for which the order is placed by procurement-manager
  productName: { type: String, required: true },
  quantity: { type: Number, required: true },
  status: {
    type: String,
    enum: ['Pending', 'In-Progress', 'Inspection Done', 'Completed'],
    default: 'Pending'
  },
  checklistId: { type: Number }, // for linking the checklistId in order
  inspectionConfirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  procurementConfirmedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },//who placed the order
},
{ timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
