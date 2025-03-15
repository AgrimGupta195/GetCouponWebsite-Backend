const express = require("express");
const { claimCoupon , getCoupons } = require("../controllers/couponController");
const { claimLimiter } = require("../middleware/rateLimiter");

const router = express.Router();

router.post("/claim/:id", claimLimiter, claimCoupon);
router.get("/coupons", getCoupons);

module.exports = router;
