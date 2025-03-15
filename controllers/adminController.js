const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Admin = require("../models/adminModel");
const Coupon = require("../models/couponModel");
const { set } = require("mongoose");
exports.loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await Admin.findOne({ email });

        if (!admin || !bcrypt.compareSync(password, admin.password)) {
            return res.status(401).json({ message: "Invalid credentials" });
        }

        const token = generateToken(admin._id,res);
        res.json({ token });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find();
        res.json(coupons);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.addCoupon = async (req, res) => {
    try {
        const { code , discount } = req.body;
        const existing = await Coupon.findOne({ code });

        if (existing) return res.status(400).json({ message: "Coupon already exists" });

        const newCoupon = new Coupon({ code , discount });
        await newCoupon.save();
        res.json(newCoupon);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};

exports.modifyCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const { code, discount } = req.body;

        const existing = await Coupon.findOne({ _id: id });

        if (!existing) return res.status(404).json({ message: "Coupon not found" });

        existing.code = code || existing.code;
        existing.discount = discount || existing.discount;

        await existing.save();
        res.json(existing);
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};


exports.deleteCoupon = async (req, res) => {
    try {
        await Coupon.findByIdAndDelete(req.params.id);
        res.json({ message: "Coupon deleted" });
    } catch (error) {
        res.status(500).json({ message: "Server error" });
    }
};
exports.toggleCouponAvailability = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await Coupon.findById(id);
        if (!coupon) return res.status(404).json({ message: "Coupon not found." });
        coupon.isAvailable = !coupon.isAvailable;
        await coupon.save();

        res.json({ message: "Coupon availability toggled!", coupon });
    } catch (error) {
        res.status(500).json({ message: "Server error", error });
    }
};

exports.logoutAdmin = (req, res) => {
    res.cookie("jwt","",{maxAge:0});
    res.setHeader("Cache-Control", "no-store");
    res.json({ message: "Logout successful" });
};
exports.checkAuth = (req,res)=>{
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Internal Server error"})   
    }
}

const generateToken = (userId,res)=>{
    const token = jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:"7d",
    });
    res.cookie("jwt",token,{
        maxAge:7*24*60*60*1000,
        httpOnly:true,
        sameSite:"None",
        secure:process.env.NODE_ENV !=="development"
    });
    return token;
}