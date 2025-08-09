import { motion } from "framer-motion";

const LoadingSpinner = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-rose-900 to-orange-900 flex items-center justify-center relative overflow-hidden">
      {/* Enhanced Loading Spinner */}
      <motion.div
        className="relative w-20 h-20"
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
      >
        {/* Main spinner ring with gradient */}
        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-t-orange-400 border-r-rose-500 blur-[1px]"></div>
        
        {/* Secondary ring for depth */}
        <div className="absolute inset-0 rounded-full border-[6px] border-transparent border-b-orange-200 border-l-rose-300 opacity-70"></div>
        
        {/* Glow effect */}
        <div className="absolute inset-0 rounded-full bg-orange-500 opacity-10 blur-md"></div>
        
      </motion.div>
      
      {/* Animated pulsing text */}
      <motion.p 
        className="absolute bottom-1/4 text-rose-200 font-light text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Loading...
      </motion.p>
    </div>
  );
};

export default LoadingSpinner;