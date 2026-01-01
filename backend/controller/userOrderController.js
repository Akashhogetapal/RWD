const {
    OrderCentralMess,
    OrderSnackCorner,
    OrderCafeDelight,
    OrderJuiceBar
} = require("../models/orders/allOrders");

const getMyOrders = async (req, res) => {
    const { user } = req.body; 
    try {
        const p1 = OrderCentralMess.find({ user });
        const p2 = OrderSnackCorner.find({ user });
        const p3 = OrderCafeDelight.find({ user });
        const p4 = OrderJuiceBar.find({ user });

        const [r1, r2, r3, r4] = await Promise.all([p1, p2, p3, p4]);

        const allOrders = [...r1, ...r2, ...r3, ...r4].sort((a, b) =>
            new Date(b.createdAt) - new Date(a.createdAt)
        );

        res.status(200).json({ success: true, orders: allOrders });

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Server Error" });
    }
};

module.exports = { getMyOrders };
