const rateLimit = require("express-rate-limit");
const claimAttempts = new Map();
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
exports.claimLimiter = (req, res, next) => {
    const ip = getWiFiIP();
    const couponId = req.params.id;
    const userIdentifier = ip
    const key = `${userIdentifier}-${couponId}`;
    const attempts = claimAttempts.get(key) || { count: 0, lastAttempt: null };

    const now = Date.now();
    const timeLimit = 10 * 60 * 1000;
    if (attempts.lastAttempt && now - attempts.lastAttempt > timeLimit) {
        attempts.count = 0;
    }
    attempts.count += 1;
    attempts.lastAttempt = now;
    if (attempts.count > 1) {
        return res.status(429).json({ message: "You have already claimed this coupon. Try again later." });
    }
    claimAttempts.set(key, attempts);
    next();
};
