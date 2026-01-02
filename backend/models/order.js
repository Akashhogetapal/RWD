const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: String, required: true },
  kitchen: { type: String, required: true }, // "Central Mess", etc.
  status: {
    type: String,
    enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Rejected'],
    default: 'Pending'
  },
  items: [
    {
      itemname: String,
      itemsrc: String,
      itemprice: Number,
      quantity: { type: Number, default: 1 }
    }
  ],

  totalItems: {
    type: Number,
    required: true
  },

  totalAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model("Order", orderSchema);
