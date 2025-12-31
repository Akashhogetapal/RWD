const Item = require('../models/item');
const fuzz = require("fuzzball");
const filter = async (req, res) => {
    try {
        const { category } = req.body;

        let items;
        let count;
        if (category === "All") {
            count= await Item.countDocuments()
            items = await Item.aggregate([
                {$sample:{size:count}}
            ]);
        } else {
            count =await Item.countDocuments({category});
            items = await Item.aggregate([
                {$match:{category}},
                {$sample:{size : count}}
            ]);
        }

        return res.status(200).json({
            message: "Filtered successfully",
            items,
            success: true
        });

    } catch (err) {
        console.error(err);
        return res.status(500).json({
            message: "Server error",
            success: false
        });
    }
};

const search = async (req, res) => {
    try {
        const query = (req.body.query || "").trim().toLowerCase();
        if (!query) {
            const items = await Item.find();
            return res.status(200).json({ items, success: true });
        }
        const regex = new RegExp(query, "i");

        const mongoHits = await Item.find({
            $or: [
                { name: { $regex: regex } },
            ]
        });
        const allItems = await Item.find();
        const fuzzyHits = [];

        allItems.forEach(item => {
            const text = `${item.name}`.toLowerCase();
            const score = fuzz.partial_ratio(query, text);

            if (score >= 70) {
                fuzzyHits.push(item);
            }
        });
        const final = {};
        [...mongoHits, ...fuzzyHits].forEach(i => {
            final[i._id] = i;
        });
        return res.status(200).json({
            success: true,
            items: Object.values(final)
        });
    } catch (err) {
        console.error("ERROR:", err);
        return res.status(500).json({
            success: false,
            message: "Server error"
        });
    }
};

module.exports = { filter,search};
