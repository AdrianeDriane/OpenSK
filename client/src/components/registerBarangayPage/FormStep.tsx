import React from "react";
import { motion } from "framer-motion";
interface FormStepProps {
  children: React.ReactNode;
  title: string;
  description?: string;
}
export function FormStep({ children, title, description }: FormStepProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        x: 20,
      }}
      animate={{
        opacity: 1,
        x: 0,
      }}
      exit={{
        opacity: 0,
        x: -20,
      }}
      transition={{
        duration: 0.4,
        ease: "easeOut",
      }}
      className="w-full"
    >
      <div className="mb-8 text-center">
        <h2 className="text-2xl font-bold text-[#203972] font-serif mb-2">
          {title}
        </h2>
        {description && <p className="text-gray-600">{description}</p>}
      </div>
      <div className="space-y-6">{children}</div>
    </motion.div>
  );
}
