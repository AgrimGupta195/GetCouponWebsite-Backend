require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const requestIp = require("request-ip");
const dotenv = require("dotenv");

const app = express();
dotenv.config();    

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
}));
app.use(express.json());
app.use(cookieParser());
app.use(requestIp.mw());

// Import Routes
const couponRoutes = require("./routes/couponRoutes");
const adminRoutes = require("./routes/adminRoutes");
const connectDB = require("./config/db");

app.use("/api/coupons", couponRoutes);
app.use("/api/admin", adminRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
    console.log(`Server running on port ${PORT}`);
    await connectDB();
});
