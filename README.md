# AuthHive

A full-stack authentication system built with React (Vite) for the frontend and Express/MongoDB for the backend. Features include secure signup, login, email verification, password reset, JWT-based sessions, and Mailtrap integration for email delivery.

---

## Features

- **User Signup & Login**: Secure password hashing, JWT sessions.
- **Email Verification**: 6-digit code, 24-hour expiry, welcome email.
- **Password Reset**: Secure token, 1-hour expiry, confirmation email.
- **Session Management**: HTTP-only cookies, CSRF protection.
- **Error Handling**: Consistent, secure responses.
- **Mailtrap Integration**: Modular email templates for all flows.

---


## Getting Started

### 1. Clone the Repository

```sh
git clone https://github.com/your-username/AuthHive.git
cd AuthHive
```

### 2. Setup Environment Variables
Create a .env file in the root and add the following (replace with your own secrets):

- MONGODB_URI=your_mongodb_connection_string
- JWT_SECRET=your_jwt_secret
- CLIENT_URL=http://localhost:5173
- MAILTRAP_TOKEN=your_mailtrap_api_token
- MAILTRAP_ENDPOINT=your_mailtrap_endpoint
- NODE_ENV=development
- PORT=5000

### 3. Install Dependencies

Backend
```sh
cd backend
npm install
```
Frontend
```sh
cd ../frontend
npm install
```
### 4. Run the Application
Start Backend

```sh
npm run dev
```
Backend runs on **http://localhost:5000**

Start Frontend

```sh
npm run dev
```
Frontend runs on **http://localhost:5173**

--- 

## Usage
- *Sign Up*: Register with name, email, password. Receive verification code via email.
- *Verify Email*: Enter code to activate account.
- *Login*: Access protected routes after verification.
- *Forgot Password*: Request password reset link via email.
- *Reset Password*: Set a new password using the emailed link.

## Development Notes
- *Mailtrap* is used for email testing. Replace with SMTP for production.
- *JWT* tokens are stored in HTTP-only cookies for security.
- *MongoDB* is required for user data storage.
- *Frontend* uses Zustand for state management and TailwindCSS for styling.

## Security
- Passwords are always hashed.
- No sensitive data is exposed in API responses.
- All tokens have expiration.
- Cookies use ***httpOnly***, ***secure***, and ***sameSite=strict***.

## Troubleshooting
- Ensure MongoDB is running and accessible.
- Check Mailtrap credentials in ***.env***.
- Use Node.js v18+ for best compatibility.