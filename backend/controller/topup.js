const Topup = require("../models/topup");
const User = require("../models/user");
const Wallet = require("../models/wallet");
const history = require("../models/TopupHistory")
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
            userkey: key,
            amt,
            utr
        });

        let wallet = await Wallet.findOne({ user: user.email });

        if (wallet) {
            wallet.balance += amt;
            await wallet.save();
        } else {
            await Wallet.create({
                userEmail: user.email,
                userKey: key, // Explicitly provide userKey
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
    try {
        const topups = await Topup.find({}).sort({ date: -1 });

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
const accepttop = async (req, res) => {
    try {
        const { key, amt, utr, type } = req.body;

        if (!key || !amt || !utr || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing required details"
            });
        }

        if (type !== "accepted") {
            return res.status(400).json({
                success: false,
                message: "Invalid request type"
            });
        }


        const userWallet = await Wallet.findOne({ userKey: key });

        if (!userWallet) {
            return res.status(404).json({
                success: false,
                message: "Wallet not found"
            });
        }


        userWallet.balance += Number(amt);
        await userWallet.save();
        await Topup.deleteOne({ utr });


        await history.create({
            userkey: key,
            amt: amt,
            utr: utr,
            type: "accepted",
            date: Date.now()
        });

        return res.status(200).json({
            success: true,
            message: "Top-up accepted and wallet updated"
        });

    } catch (error) {
        console.error("accepttop error:", error);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};
const rejecttop = async (req, res) => {
    try {
        const { key, amount, type, utr } = req.body;

        if (!key || !amount || !utr || !type) {
            return res.status(400).json({
                success: false,
                message: "Missing Details"
            });
        }

        if (type !== "rejected") {
            return res.status(400).json({
                success: false,
                message: "Invalid request type"
            });
        }

        await history.create({
            userkey: key,
            amt: amount,
            utr: utr,
            type: "rejected",
            date: Date.now()
        });

        // Remove from pending list
        const deleted = await Topup.deleteOne({ utr });

        if (deleted.deletedCount === 0) {
            console.log("Warning: Topup request not found in pending list for deletion");
        }

        return res.status(200).json({
            success: true,
            message: "Top-up rejected and removed"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }

    const getTopupStats = async (req, res) => {
        try {
            const allHistory = await history.find({});
            const total = allHistory.length;
            const accepted = allHistory.filter(h => h.type === "accepted").length;
            const rejected = allHistory.filter(h => h.type === "rejected").length;

            return res.status(200).json({
                success: true,
                stats: {
                    total,
                    accepted,
                    rejected
                }
            });
        } catch (error) {
            console.log(error);
            return res.status(500).json({
                success: false,
                message: "Server Error"
            });
        }
    }
}

const getRecentTopupHistory = async (req, res) => {
    try {
        const historyData = await history.find({}).sort({ date: -1 }).limit(10);
        return res.status(200).json({
            success: true,
            data: historyData
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
}
module.exports = {
    createTopup,
    getTopups,
    accepttop,
    rejecttop,
    rejecttop,
    getRecentTopupHistory,
    getTopupStats
};