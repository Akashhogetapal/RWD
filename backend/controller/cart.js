const Cart = require('../models/cart');
const User = require('../models/user');
const Order = require('../models/order');
const add2cart = async (req, res) => {
    const { user, itemprice, itemsrc, itemname } = req.body;

    try {
        const userexits = await User.findOne({ email: user });
        if (!userexits) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        let cart = await Cart.findOne({ user: user });
        if (cart) {
            const itemIndex = cart.items.findIndex(p => p.itemname === itemname)
            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += 1;
            }
            else {
                cart.items.push({ itemname, itemsrc, itemprice, kitchen: req.body.kitchen, quantity: 1 });
            }
            await cart.save();
            return res.status(200).json({ success: true, message: "Cart updated" });
        }
        else {
            const newcart = await Cart.create({
                user,
                items: [{ itemname, itemsrc, itemprice, kitchen: req.body.kitchen, quantity: 1 }]
            });
            return res.status(200).json({ success: true, message: "New cart created" });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const returncart = async (req, res) => {
    try {
        const { user } = req.body;

        const cart = await Cart.findOne({ user: user });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart Not found" });
        }
        return res.status(200).json({
            items: cart.items,
            success: true,
            message: "Cart found"
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}
const deleteItem = async (req, res) => {
    const { user, itemname } = req.body;

    try {
        const cart = await Cart.findOne({ user: user });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }
        cart.items = cart.items.filter(item => item.itemname !== itemname);

        await cart.save();
        return res.status(200).json({ success: true, message: "Item deleted", });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}
const removeQuantity = async (req, res) => {
    const { user, itemname } = req.body;

    try {
        const cart = await Cart.findOne({ user: user });

        if (!cart) {
            return res.status(404).json({ success: false, message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(p => p.itemname === itemname);

        if (itemIndex > -1) {
            if (cart.items[itemIndex].quantity > 1) {
                cart.items[itemIndex].quantity -= 1;
            } else {
                cart.items.splice(itemIndex, 1);
            }

            await cart.save();
            return res.status(200).json({ success: true, message: "Quantity updated" });
        } else {
            return res.status(404).json({ success: false, message: "Item not found in cart" });
        }

    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}

const {
    OrderCentralMess,
    OrderSnackCorner,
    OrderCafeDelight,
    OrderJuiceBar
} = require("../models/orders/allOrders");

const clearcart = async (req, res) => {
    const { user, items, totalItems, totalAmount } = req.body;
    try {
        if (!user || !items || items.length === 0) {
            console.log("clearcart: Invalid input", { user, itemsLen: items ? items.length : 0 });
            return res.status(400).json({ success: false });
        }

        console.log(`clearcart: Placing order for user ${user}. Items:`, JSON.stringify(items, null, 2));

        await Cart.updateOne(
            { user },
            { $set: { items: [] } }
        )

        const ordersByKitchen = {};
        items.forEach(item => {
            const k = item.kitchen || "Central Mess"; 
            console.log(`Item: ${item.itemname}, Kitchen Field: ${item.kitchen}, Resolved Kitchen: ${k}`);
            if (!ordersByKitchen[k]) ordersByKitchen[k] = [];
            ordersByKitchen[k].push(item);
        });

        console.log("Orders grouped by kitchen:", Object.keys(ordersByKitchen));

        for (const kitchen in ordersByKitchen) {
            const kItems = ordersByKitchen[kitchen];
            const kTotal = kItems.reduce((acc, item) => acc + (item.itemprice * item.quantity), 0);

            const orderData = {
                user,
                kitchen,
                items: kItems,
                totalItems: kItems.reduce((acc, i) => acc + i.quantity, 0),
                totalAmount: kTotal
            };

            if (kitchen === "Snack Corner") await OrderSnackCorner.create(orderData);
            else if (kitchen === "Cafe Delight") await OrderCafeDelight.create(orderData);
            else if (kitchen === "Juice Bar") await OrderJuiceBar.create(orderData);
            else {
                console.log(`Defaulting kitchen '${kitchen}' to Central Mess collection.`);
                await OrderCentralMess.create(orderData);
            }
        }
        return res.status(200).json({
            success: true,
            message: "Order Placed"
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Server Error" });
    }
}
const getorder = async (req, res) => {
    return res.status(200).json({ success: true, data: [] });
}
module.exports = { add2cart, returncart, deleteItem, removeQuantity, clearcart, getorder };