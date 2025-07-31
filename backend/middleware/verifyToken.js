import jwt from "jsonwebtoken";

// JWT Token Verification Middleware - authenticates requests by verifying the JWT token from cookies.
export const verifyToken = (req, res, next) => {
	const token = req.cookies.token; // Extract JWT token from HTTP-only cookie
	if (!token) return res.status(401).json({ success: false, message: "Unauthorized - no token provided" });
	try {
        // Verify token validity using the JWT secret from environment variables
		const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // Additional check in case verification returns null/undefined
		if (!decoded) return res.status(401).json({ success: false, message: "Unauthorized - invalid token" });

        // Attach the decoded user ID to the request object
        // This makes it available to subsequent middleware/route handlers
		req.userId = decoded.userId;
        //! Call next() to proceed to the next middleware/route handler : after verifyToken, the next middleware is checkAuth
		next();
	} catch (error) {
		console.log("Error in verifyToken ", error);
		return res.status(500).json({ success: false, message: "Server error" });
	}
};
