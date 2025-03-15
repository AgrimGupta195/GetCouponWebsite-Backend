const express = require("express");
const { loginAdmin, getCoupons, addCoupon, deleteCoupon, toggleCouponAvailability, logoutAdmin, checkAuth, modifyCoupon } = require("../controllers/adminController");

const {isAdmin,protectRoute} = require("../middleware/authMiddleware");
const router = express.Router();


router.post("/login", loginAdmin);
router.get("/coupons",protectRoute,isAdmin, getCoupons);
router.get("/check",protectRoute,isAdmin,checkAuth)
router.post("/add",protectRoute,isAdmin, addCoupon);
router.put("/edit/:id",protectRoute,isAdmin, modifyCoupon);
router.delete("/delete/:id",protectRoute,isAdmin, deleteCoupon);
router.patch("/isAvailable/:id",protectRoute,isAdmin,toggleCouponAvailability);
router.post("/logout",logoutAdmin);
module.exports = router;
