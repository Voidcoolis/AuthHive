import { Check, X } from "lucide-react";

const PasswordCriteria = ({ password }) => {
  // Array of password criteria with their labels and validation functions
  const criteria = [
    { label: "At least 6 characters", met: password.length >= 6 },
    { label: "Contains uppercase letter", met: /[A-Z]/.test(password) },
    { label: "Contains lowercase letter", met: /[a-z]/.test(password) },
    { label: "Contains a number", met: /\d/.test(password) },
    { label: "Contains special character", met: /[^A-Za-z0-9]/.test(password) },
  ];

  return (
    <div className="mt-2 space-y-1">
      {/* Map through each criteria and display its status */}
      {criteria.map((item) => (
        <div key={item.label} className="flex items-center text-xs">
          {/* Show green checkmark if met, gray X if not */}
          {item.met ? (
            <Check className="size-4 text-green-500 mr-2" />
          ) : (
            <X className="size-4 text-gray-500 mr-2" />
          )}
          {/* Text color changes based on whether criteria is met */}
          <span className={item.met ? "text-green-500" : "text-gray-400"}>
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
};

// PasswordStrengthMeter Component - Evaluates and displays password strength
const PasswordStrengthMeter = ({ password }) => {
  // Calculates password strength based on various criteria
  const getStrength = (pass) => {
    let strength = 0;
    if (pass.length >= 6) strength++; // Minimum length
    if (pass.match(/[a-z]/) && pass.match(/[A-Z]/)) strength++; // Both lowercase and uppercase
    if (pass.match(/\d/)) strength++; // Contains a number
    if (pass.match(/[^a-zA-Z\d]/)) strength++; // Contains special character
    return strength;
  };
  const strength = getStrength(password); // Calculate current password strength

  const getColor = (strength) => {
    if (strength === 0) return "bg-red-500"; // Very weak
    if (strength === 1) return "bg-red-400"; // Weak
    if (strength === 2) return "bg-yellow-500"; // Fair
    if (strength === 3) return "bg-yellow-400"; // Good
    return "bg-green-500"; // Strong
  };

  const getStrengthText = (strength) => {
    if (strength === 0) return "Very Weak";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="mt-2">
        {/* Strength indicator header with text label */}
      <div className="flex justify-between items-center mb-1">
        <span className="text-xs text-gray-400">Password strength</span>
        <span className="text-xs text-gray-400">
          {getStrengthText(strength)}
        </span>
      </div>

      {/* Visual strength meter with 4 bars */}
      <div className="flex space-x-1">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className={`h-1 w-1/4 rounded-full transition-colors duration-300 
                ${index < strength ? getColor(strength) : "bg-gray-600"}
              `}
          />
        ))}
      </div>
      
      {/* Display password criteria checklist */}
      <PasswordCriteria password={password} />
    </div>
  );
};
export default PasswordStrengthMeter;
