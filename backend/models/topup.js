const mongoose = require("mongoose");

const topupSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    userkey: {
        type: String,
        required: true
    },
    amt: {
        type: Number,
        required: true
    },
    utr: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Topup", topupSchema);