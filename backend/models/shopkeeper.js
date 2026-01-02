const mongoose = require("mongoose");

const shopkeeperSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    kitchenName: {
        type: String,
        required: true,
        enum: ["Central Mess", "Snack Corner", "Cafe Delight", "Juice Bar"]
    }
});

module.exports = mongoose.model("Shopkeeper", shopkeeperSchema);
