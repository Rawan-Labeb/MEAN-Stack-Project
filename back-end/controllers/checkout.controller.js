const { createOrder } = require("../services/order.service");

module.exports.createOrder = async (req, res) => {
    try {
        console.log("🔥 Received Order Data:", JSON.stringify(req.body, null, 2)); // ✅ طباعة البيانات قبل المعالجة

        const result = await createOrder(req.body);

        if (!result.success) {
            console.error("❌ Order validation failed:", result.message); // ✅ طباعة الخطأ
            return res.status(400).json({ error: result.message });
        }

        return res.status(201).json(result.message);
    } catch (error) {
        console.error("❌ Server Error:", error.message);
        res.status(500).json({ error: error.message });
    }
};
