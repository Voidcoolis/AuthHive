import jwt from "jsonwebtoken";

//  Generates a JWT token and sets it as an HTTP-only cookie in the response
export const generateTokenAndSetCookie = (res, userId) => {
  // Create a JWT token with the user ID as payload
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set the token as an HTTP-only cookie in the response
  res.cookie("token", token, {
    httpOnly: true,  // Cookie cannot be accessed by client-side JavaScript
    secure: process.env.NODE_ENV === "production", // Cookie only sent over HTTPS in production
    sameSite: "strict", // Cookie only sent to same site (prevents CSRF attacks)
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration: 7 days
  });

  return token;
};
