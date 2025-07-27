import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";

// Signup controller - Creates a new user account
export const signup = async(req, res) => {
    const { email, password, name } = req.body; // Destructure the request body to get email, password, and name

    try {
        // Validate required fields
        if (!email || !password || !name) {
			throw new Error("All fields are required");
		}

        // check if user already exists with only the email
        const userAlreadyExists = await User.findOne({ email });
		console.log("userAlreadyExists", userAlreadyExists);

		if (userAlreadyExists) {
			return res.status(400).json({ success: false, message: "User already exists" });
		}

        const hashedPassword = await bcryptjs.hash(password, 10); // Hash the password with a salt round of 10
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString(); // Generate a 6-digit verification token

        const user = new User({
			email,
			password: hashedPassword,
			name,
			verificationToken,
			verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
		});

		await user.save(); //! Save user to database

		generateTokenAndSetCookie(res, user._id); // Generate JWT token and set it as an HTTP-only cookie

        // Return success response (excluding password)
		res.status(201).json({
			success: true,
			message: "User created successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});

    } catch (error) {
        res.status(400).json({ success: false, message: error.message });
    }
};

export const login = async(req, res) => {
    res.send("Login route");
};

export const logout = async(req, res) => {
    res.send("Logut route");
};