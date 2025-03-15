const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const Admin = require("../models/adminModel");
dotenv.config();
exports.protectRoute = async(req,res,next)=>{
    try {
        const token = req.cookies.jwt;
        if(!token){
            return res.status(401).json({message:"Unauthorized-No token Provided"})
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({message:"Unauthorized-No token Provided"});
        }
        const user = await Admin.findById(decoded.userId).select("-password");
        if(!user){
            return res.status(404).json({message:"User Not Found"});
        }
        req.user = user;
        next();

    } catch (error) {
        console.log(error);
        
    }
}
exports.isAdmin = async (req, res, next) => {
	try {
		const user = req.user;
		if (user.role !== "admin") {
			return res.status(403).json({ message: "Forbidden - User is not an admin" });
		}
		next();
	} catch (error) {
		console.log("Error in isAdmin middleware", error.message);
		return res.status(500).json({ message: "Server error", error: error.message });
	}
};
