const rateLimit = require("express-rate-limit");

exports.claimLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 1,
    message: "Too many requests, try again later.",
});
