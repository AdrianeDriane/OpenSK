import { motion } from "framer-motion";
import { Check } from "lucide-react";
interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  labels?: string[];
}
export function StepIndicator({
  currentStep,
  totalSteps,
  labels,
}: StepIndicatorProps) {
  return (
    <div className="w-full max-w-3xl mx-auto mb-12">
      <div className="relative flex items-center justify-between">
        {/* Background Line */}
        <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full" />

        {/* Active Progress Line */}
        <motion.div
          className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-[#203972] -z-10 rounded-full"
          initial={{
            width: "0%",
          }}
          animate={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
          transition={{
            duration: 0.5,
            ease: "easeInOut",
          }}
        />

        {/* Steps */}
        {Array.from({
          length: totalSteps,
        }).map((_, index) => {
          const stepNumber = index + 1;
          const isActive = stepNumber === currentStep;
          const isCompleted = stepNumber < currentStep;
          return (
            <div key={index} className="flex flex-col items-center relative">
              <motion.div
                className={`w-10 h-10 rounded-full flex items-center justify-center border-2 font-bold text-sm z-10 bg-white transition-colors duration-300
                  ${
                    isActive || isCompleted
                      ? "border-[#203972] text-[#203972]"
                      : "border-gray-300 text-gray-400"
                  }
                  ${isCompleted ? "bg-[#203972] text-white" : ""}
                `}
                initial={false}
                animate={{
                  scale: isActive ? 1.1 : 1,
                  backgroundColor: isCompleted ? "#203972" : "#ffffff",
                  borderColor: isActive || isCompleted ? "#203972" : "#d1d5db",
                  color: isCompleted
                    ? "#ffffff"
                    : isActive
                    ? "#203972"
                    : "#9ca3af",
                }}
                transition={{
                  duration: 0.3,
                }}
              >
                {isCompleted ? (
                  <Check className="w-5 h-5" />
                ) : (
                  <span>{stepNumber}</span>
                )}
              </motion.div>

              {labels && labels[index] && (
                <div
                  className={`absolute top-14 w-32 text-center text-xs font-medium transition-colors duration-300 ${
                    isActive ? "text-[#203972] font-bold" : "text-gray-500"
                  }`}
                >
                  {labels[index]}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
