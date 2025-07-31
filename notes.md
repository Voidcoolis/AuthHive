# auth.controller.js

1. Password Security:
- Always hashed with bcrypt before storage
- Never returned in API responses
- Secure comparison during login

2. Session Management:
- JWT tokens in HTTP-only cookies
- SameSite strict for CSRF protection
- Secure flag in production (HTTPS only)

3. Email Verification:
- Mandatory 6-digit code verification
- 24-hour expiration for verification tokens
- Welcome email after successful verification

4. Password Reset:
- Cryptographically secure tokens (crypto.randomBytes)
- 1-hour expiration for reset tokens
- Success confirmation email

5. Error Handling:
- Consistent error response format
- Generic messages for auth failures
- Proper HTTP status codes

6. Security Best Practices:
- No user enumeration in error messages
- Minimal data exposure in responses
- Token expiration for all temporary tokens
- Secure cookie attributes

## Important Implementation Notes:
1. The code follows RESTful conventions with:
- Proper HTTP status codes (200, 201, 400, 500)
- Consistent response formats
- Appropriate HTTP methods

2. Security considerations:
- Different token types for different purposes
- Token expiration for all temporary operations
- Secure password handling at all stages

3. The authentication flow includes:
- Signup with email verification
- Login with session creation
- Secure password reset
- Session validation

This implementation provides a complete, production-ready authentication system with proper security measures at each step.

# emails.js

1. Modular Email Templates:
- Templates are imported from separate files for maintainability
- Dynamic content injected using string replacement
- Supports both simple HTML and UUID-based templates

2. Security Considerations:
- Minimal logging for sensitive operations (password reset)
- Errors are properly caught and re-thrown with context
- Consistent recipient format for Mailtrap API

2. Email Types:
- Verification Emails: Contain 6-digit codes
- Welcome Emails: Use template variables for personalization
- Password Reset: Include secure reset links
- Reset Confirmation: Acknowledge successful password change

4. Mailtrap Integration:
- Uses pre-configured client and sender
- Supports both simple HTML and advanced templates
- Includes categories for email analytics

5. Error Handling:
- Consistent try-catch pattern across all functions
- Errors include context about which email failed
- Original error is preserved in the thrown exception

## Usage Notes:
1. Template Variables:
- Simple templates use *string.replace()*
- Complex templates use Mailtrap's template variables system

2. Configuration:
- Requires proper setup of *mailtrap.config.js*
- Sender email must be verified in Mailtrap

3. Production Readiness:
- Replace Mailtrap with real SMTP service in production
- Consider adding retry logic for failed sends
- Add email queueing for high-volume applications

4. Testing:
- All functions throw errors that should be caught by controllers
- Mailtrap's sandbox is perfect for development testing

This implementation provides a clean, maintainable email service layer that handles all authentication-related emails with proper error handling and security considerations.

# JWT Token Verification Middleware - verifyToken.js

## File
`middleware/verifyToken.js`

## Purpose
Authenticates incoming requests by verifying JSON Web Tokens (JWT) from HTTP-only cookies.

## Security Features
- **HTTP-only cookies**: Prevents XSS attacks
- **Environment secret**: Uses *process.env.JWT_SECRET*
- **Strict validation**: Verifies both presence and validity
- **Secure errors**: Generic messages prevent information leakage

## Usage
1. In routes :
```javascript
router.get('/protected-route', verifyToken, (req, res) => {
    // Access authenticated user's ID
    res.json({ userId: req.userId });
});
```
2. In app setup: 
```javascript
// // Required for cookie handling - Must initialize cookie parser before routes
app.use(cookieParser());
```

## Dependencies
- **jsonwebtoken**: Token verification
- **cookie-parser**: Cookie extraction
- Environment variable: **JWT_SECRET**