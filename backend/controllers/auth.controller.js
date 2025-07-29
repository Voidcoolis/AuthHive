import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";

// Signup controller - Creates a new user account
export const signup = async (req, res) => {
  const { email, password, name } = req.body; // Destructure the request body to get email, password, and name

  try {
    // Validation - Check all required fields are present
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

    await sendVerificationEmail(user.email, verificationToken); // Send verification email with the token

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

//! EMAIL VERIFICATION CONTROLLER : Validates the 6-digit code sent to user's email
// Flow: Find user → Verify code → Mark verified → Send welcome
export const verifyEmail = async (req, res) => {
  const { code } = req.body;
  try {
    //* Find user with matching non-expired token
    const user = await User.findOne({
      verificationToken: code,
      verificationTokenExpiresAt: { $gt: Date.now() },
    });

    // Handle invalid/expired codes
    if (!user) {
      return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
    }

    user.isVerified = true; // Mark the user as verified
    user.verificationToken = undefined; // Clear the verification token from the database
    user.verificationTokenExpiresAt = undefined; // Clear the expiration time from the database
    await user.save();

    await sendWelcomeEmail(user.email, user.name); // Send a welcome email after verification

    res.status(200).json({
      success: true,
      message: "Email verified successfully",
      user: {
        ...user._doc,
        password: undefined, // Never expose password
      },
    });
  } catch (error) {
    console.log("error in verifyEmail ", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

//! LOGIN CONTROLLER: Authenticates existing users
// Flow: Find user → Verify password → Update last login → Set cookie
export const login = async (req, res) => {
	const { email, password } = req.body; // Extract credentials from request
	
  try {
		const user = await User.findOne({ email });
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}
		const isPasswordValid = await bcryptjs.compare(password, user.password); // Compare the provided password with the hashed password in the database
		if (!isPasswordValid) {
			return res.status(400).json({ success: false, message: "Invalid credentials" });
		}

		generateTokenAndSetCookie(res, user._id);

		user.lastLogin = new Date(); // Update last login timestamp
		await user.save();

		res.status(200).json({
			success: true,
			message: "Logged in successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("Error in login ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};

export const logout = async (req, res) => {
	res.clearCookie("token");  // Clear the authentication cookie: Matches cookie name from generateTokenAndSetCookie.js
	res.status(200).json({ success: true, message: "Logged out successfully" });
};
