const Topup = require("../models/topup");
const User = require("../models/user");
const Wallet = require("../models/wallet");

/**
 * CREATE TOPUP
 * key → login verification key
 */
const createTopup = async (req, res) => {
    const { key, amt, utr } = req.body;

    try {
        // basic validation
        if (!key || !amt || !utr) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }

        // verify key belongs to a valid user
        const user = await User.findOne({ spl_key: key });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid key"
            });
        }

        // prevent duplicate UTR
        const utrExists = await Topup.findOne({ utr });
        if (utrExists) {
            return res.status(409).json({
                success: false,
                message: "UTR already used"
            });
        }

        // save topup
        await Topup.create({
            key,
            amt,
            utr
        });

        // update wallet balance
        let wallet = await Wallet.findOne({ user: user.email });

        if (wallet) {
            wallet.balance += amt;
            await wallet.save();
        } else {
            await Wallet.create({
                user: user.email,
                balance: amt
            });
        }

        return res.status(201).json({
            success: true,
            message: "Topup successful"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

/**
 * GET TOPUP HISTORY (by key)
 */
const getTopups = async (req, res) => {
    const { key } = req.body;

    try {
        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Key required"
            });
        }

        const topups = await Topup.find({ key }).sort({ date: -1 });

        return res.status(200).json({
            success: true,
            data: topups
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};

module.exports = {
    createTopup,
    getTopups
};