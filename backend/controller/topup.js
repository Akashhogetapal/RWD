const Topup = require("../models/topup");
const User = require("../models/user");
const Wallet = require("../models/wallet");

const createTopup = async (req, res) => {
    const { key, amt, utr } = req.body;

    try {
        if (!key || !amt || !utr) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields"
            });
        }
        const user = await User.findOne({ key });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Invalid key"
            });
        }
        const utrExists = await Topup.findOne({ utr });
        if (utrExists) {
            return res.status(409).json({
                success: false,
                message: "UTR already used"
            });
        }

        await Topup.create({
            userkey:key,
            amt,
            utr
        });

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

const getTopups = async (req, res) => {
    const { key } = req.body;

    try {
        if (!key) {
            return res.status(400).json({
                success: false,
                message: "Key required"
            });
        }

        const topups = await Topup.find({ userkey:key }).sort({ date: -1 });

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