const mongoose = require("mongoose");

const topupSchema = new mongoose.Schema({
    key: {
        type: String,      // spl_key from User
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