const mongoose = require("mongoose");

const itemSchema = {
    itemname: String,
    itemsrc: String,
    itemprice: Number,
    quantity: { type: Number, default: 1 }
};

const orderSchemaObj = {
    user: { type: String, required: true },
    kitchen: { type: String, required: true },
    status: {
        type: String,
        enum: ['Pending', 'Accepted', 'Preparing', 'Ready', 'Served', 'Rejected'],
        default: 'Pending'
    },
    items: [itemSchema],
    totalItems: { type: Number, required: true },
    totalAmount: { type: Number, required: true },
    createdAt: { type: Date, default: Date.now }
};

const centralMessSchema = new mongoose.Schema(orderSchemaObj);
const snackCornerSchema = new mongoose.Schema(orderSchemaObj);
const cafeDelightSchema = new mongoose.Schema(orderSchemaObj);
const juiceBarSchema = new mongoose.Schema(orderSchemaObj);

module.exports = {
    OrderCentralMess: mongoose.model("OrderCentralMess", centralMessSchema),
    OrderSnackCorner: mongoose.model("OrderSnackCorner", snackCornerSchema),
    OrderCafeDelight: mongoose.model("OrderCafeDelight", cafeDelightSchema),
    OrderJuiceBar: mongoose.model("OrderJuiceBar", juiceBarSchema)
};
