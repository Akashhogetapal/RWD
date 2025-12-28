const mongoose = require("mongoose");

const plannerSchema = new mongoose.Schema({
    day: {
        type: String,
        required: true
    },
    activity: {
        type: String,
        required: true
    },
    fromtime: {
        type: String,
        required: true
    },
    totime: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Planner", plannerSchema);