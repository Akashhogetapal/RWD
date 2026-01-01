const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema({
    user: { type: String, required: true },
    items: [
        {
            itemname: String,
            itemsrc: String,
            itemprice: Number,
            kitchen: String, 
            quantity: { type: Number, default: 1 }
        }
    ]
});

module.exports = mongoose.model("Cart", cartSchema);