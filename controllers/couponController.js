const Coupon = require("../models/couponModel");
const COOLDOWN_PERIOD = 5 * 60 * 1000;
const os = require("os");

const getWiFiIP = () => {
    const interfaces = os.networkInterfaces();
    for (let interfaceName in interfaces) {
        for (let iface of interfaces[interfaceName]) {
            if (iface.family === "IPv4" && !iface.internal) {
                return iface.address;
            }
        }
    }
    return "127.0.0.1";
};
exports.getCoupons = async (req, res) => {
    try {
        const ip = getWiFiIP();
        const coupons = await Coupon.find({
            $or: [
                { isAvailable: true, isClaimed: false },
                { claimedBy: ip }
            ]
        });

        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};



const mongoose = require("mongoose");

exports.claimCoupon = async (req, res) => {
    try {
        const ip = getWiFiIP();
        const now = new Date();
        const { id } = req.params;
        const lastClaim = await Coupon.findOne({
            _id:id,
            claimedBy: ip,
            claimedAt: { $gte: new Date(now - COOLDOWN_PERIOD) },
        });

        if (lastClaim) {
            return res.status(429).json({
                message: "You have already claimed a coupon. Please wait before claiming another."
            });
        }
        const coupon = await Coupon.findById(id);
        
        if (!coupon) {
            return res.status(404).json({ message: "Coupon not found." });
        }

        console.log("Coupon found:", coupon);

        if (coupon.isClaimed) {
            return res.status(400).json({ message: "Coupon is already claimed." });
        }

        coupon.isClaimed = true;
        coupon.claimedBy = ip;
        coupon.claimedAt = new Date();
        await coupon.save();

        res.json({ message: "Coupon claimed!", couponId: coupon._id, couponCode: coupon.code });

    } catch (error) {
        console.error("Error claiming coupon:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
};
