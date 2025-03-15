const mongoose = require("mongoose");

const CouponSchema = new mongoose.Schema({
    code: { type: String, unique: true, required: true },
    isClaimed: { type: Boolean, default: false },
    claimedBy: { type: String, default: null },
    discount: { type: Number, default: 0 },
    isAvailable: { type: Boolean, default: true },
    claimedAt: { type: Date, default: null },
}, { timestamps: true });

module.exports = mongoose.model("Coupon", CouponSchema);