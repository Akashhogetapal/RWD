const Shopkeeper = require("../models/shopkeeper");
const {
    OrderCentralMess,
    OrderSnackCorner,
    OrderCafeDelight,
    OrderJuiceBar
} = require("../models/orders/allOrders");

const shopLogin = async (req, res) => {
    const { email, password } = req.body;
    try {
        const shopkeeper = await Shopkeeper.findOne({ email });
        if (!shopkeeper || shopkeeper.password !== password) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }
        res.status(200).json({
            success: true,
            message: "Login successful",
            kitchenName: shopkeeper.kitchenName,
            name: shopkeeper.name
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const getShopOrders = async (req, res) => {
    const { kitchenName } = req.body;
    try {
        let OrderModel;
        if (kitchenName === "Central Mess") OrderModel = OrderCentralMess;
        else if (kitchenName === "Snack Corner") OrderModel = OrderSnackCorner;
        else if (kitchenName === "Cafe Delight") OrderModel = OrderCafeDelight;
        else if (kitchenName === "Juice Bar") OrderModel = OrderJuiceBar;
        else return res.status(400).json({ success: false, message: "Invalid Kitchen" });

        const orders = await OrderModel.find({}).sort({ createdAt: -1 });
        res.status(200).json({ success: true, orders });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

const updateOrderStatus = async (req, res) => {
    const { orderId, status } = req.body;


    try {
        let updated = await OrderCentralMess.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updated) updated = await OrderSnackCorner.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updated) updated = await OrderCafeDelight.findByIdAndUpdate(orderId, { status }, { new: true });
        if (!updated) updated = await OrderJuiceBar.findByIdAndUpdate(orderId, { status }, { new: true });

        if (updated) res.status(200).json({ success: true, message: "Status updated" });
        else res.status(404).json({ success: false, message: "Order not found" });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

module.exports = { shopLogin, getShopOrders, updateOrderStatus };
