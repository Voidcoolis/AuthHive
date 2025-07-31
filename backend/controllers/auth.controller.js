import { User } from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { generateTokenAndSetCookie } from "../utils/generateTokenAndSetCookie.js";
import { sendPasswordResetEmail, sendResetSuccessEmail, sendVerificationEmail, sendWelcomeEmail } from "../mailtrap/emails.js";
import crypto from "crypto";

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

// FORGOT PASSWORD CONTROLLER: Handles password reset requests
export const forgotPassword = async (req, res) => {
	const { email } = req.body;
	try {
		const user = await User.findOne({ email });

     // Return success even if user not found (security measure)
		if (!user) {
			return res.status(400).json({ success: false, message: "User not found" });
		}

		// Generate cryptographically secure token
		const resetToken = crypto.randomBytes(20).toString("hex");
		const resetTokenExpiresAt = Date.now() + 1 * 60 * 60 * 1000; // 1 hour

    // Save token to user document
		user.resetPasswordToken = resetToken;
		user.resetPasswordExpiresAt = resetTokenExpiresAt;

		await user.save(); //update the db

		// send email
		await sendPasswordResetEmail(user.email, `${process.env.CLIENT_URL}/reset-password/${resetToken}`);

		res.status(200).json({ success: true, message: "Password reset link sent to your email" });
	} catch (error) {
		console.log("Error in forgotPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
  };

  // PASSWORD RESET CONTROLLER - Handles actual password update with valid token
  //  Flow: Validate token → Hash new password → Clear token → Send confirmation
  export const resetPassword = async (req, res) => {
	try {
		const { token } = req.params; // Extract token from URL
		const { password } = req.body;  // Extract new password from request body

    //  Find user with valid non-expired token
		const user = await User.findOne({
			resetPasswordToken: token,
			resetPasswordExpiresAt: { $gt: Date.now() },
		});

    // Handle invalid/expired tokens
		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
		}

		// Hash new password before storage
		const hashedPassword = await bcryptjs.hash(password, 10);

    // Update password and clear reset fields
		user.password = hashedPassword;
		user.resetPasswordToken = undefined;
		user.resetPasswordExpiresAt = undefined;
		await user.save();

    // Send password change confirmation
		await sendResetSuccessEmail(user.email);

		res.status(200).json({ success: true, message: "Password reset successful" });
	} catch (error) {
		console.log("Error in resetPassword ", error);
		res.status(400).json({ success: false, message: error.message });
	}
};