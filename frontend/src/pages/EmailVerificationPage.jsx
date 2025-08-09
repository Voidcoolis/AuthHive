import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

const EmailVerificationPage = () => {
  const [code, setCode] = useState(["", "", "", "", "", ""]); // Assuming a 6-digit code
  const inputRefs = useRef([]); // refs for each input field to manage focus (track input)
  const navigate = useNavigate();

  //   Handles changes in verification code inputs
  const handleChange = (index, value) => {
    const newCode = [...code]; // Create a copy of current code

    // Handle pasted content (when user pastes a code)
    if (value.length > 1) {
      const pastedCode = value.slice(0, 6).split(""); // Take first 6 characters
      //* Update each code digit with pasted values
      for (let i = 0; i < 6; i++) {
        newCode[i] = pastedCode[i] || "";
      }
      setCode(newCode);
      // Focus management after paste - Focus on the last non-empty input or the first empty one
      const lastFilledIndex = newCode.findLastIndex((digit) => digit !== "");
      const focusIndex = lastFilledIndex < 5 ? lastFilledIndex + 1 : 5;
      inputRefs.current[focusIndex].focus();
    } else {
      // Normal single-character input
      newCode[index] = value;
      setCode(newCode);

      // When you paste the code(for example you copy 2 digits) focus to next field if a digit was entered(so to say the third digit input)
      if (value && index < 5) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

//   Handles keydown events (specifically backspace)
  const handleKeyDown = (index, e) => {
    // If backspace pressed on empty field, move focus to previous field
		if (e.key === "Backspace" && !code[index] && index > 0) {
			inputRefs.current[index - 1].focus();
		}
	};

    const handleSubmit = (e) => {
		e.preventDefault(); //so that the form does not refresh the page
		const verificationCode = code.join(""); // Combine array into string
		console.log("Verification Code Submitted:", verificationCode);
	};

    // Effect to auto-submit when all 6 digits are entered
	useEffect(() => {
		if (code.every((digit) => digit !== "")) {
			handleSubmit(new Event("submit"));
		}
	}, [code]); // Runs whenever code changes

  return (
    <div
      className="max-w-md w-full 
      bg-gradient-to-br from-orange-400/20 via-pink-400/20 to-red-400/20
      backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-white/10"
    >
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-2xl p-8 w-full max-w-md"
      >
        <h2
          className="text-3xl font-bold mb-6 text-center 
          bg-gradient-to-r from-yellow-400 via-orange-500 to-pink-500
          text-transparent bg-clip-text"
        >
          Email Verification
        </h2>

        <p className="text-center text-gray-300 mb-6">
          Please enter the verification code sent to your email.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between">
            {code.map((digit, index) => (
              <input
                key={index}
                ref={(el) => (inputRefs.current[index] = el)}
                type="text"
                maxLength="6"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-2xl font-bold 
                  bg-gray-800 bg-opacity-50 text-white 
                  border-2 border-gray-600 rounded-lg 
                  focus:border-orange-400 focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50
                  transition duration-200 outline-none"
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            type="submit"
            className="w-full bg-gradient-to-r from-orange-500 to-pink-500 
              text-white font-bold py-3 px-4 rounded-lg shadow-lg 
              hover:from-orange-600 hover:to-pink-600 
              focus:outline-none focus:ring-2 focus:ring-orange-400 focus:ring-opacity-50 
              disabled:opacity-50 transition duration-200"
          >
            Verify Email
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
};

export default EmailVerificationPage;
