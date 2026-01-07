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
        let { key, amount, type, utr } = await req.body;
        if (!key || amount || type || utr) {
            return res.status(400).json({
                success: true,
                message: "Missing Details",
            })
        }
        else {
            await history.create({
                userkey: key,
                amt: amount,
                utr: utr,
                type: "rejected",
                date: Date.now()
            })
            return res.status(200).json({
                success: true,
                message: "Updated",
            })
        }
    }
    catch (error) {
        console.log(error);
        return res.status(500).json({
            success: false,
            message: "Server Error"
        })
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
    getRecentTopupHistory
};