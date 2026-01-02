const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    kitchen: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    tags: {
        type: [String],
        required: false
    },
    imageUrl: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: false
    },
    available: {
        type: Boolean,
        default: true
    }
});
module.exports = mongoose.model("Item", itemSchema);
