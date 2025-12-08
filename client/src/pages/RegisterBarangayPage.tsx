import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "../components/registerBarangayPage/StepIndicator";
import { FormStep } from "../components/registerBarangayPage/FormStep";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  Building2,
  User,
} from "lucide-react";

import SKLogo from "../assets/icons/sk_logo.png";

export function RegisterBarangayPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const nextStep = () => {
    if (currentStep < totalSteps) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      {/* Header Logo */}
      <div className="mb-10 flex items-center">
        <div className="w-10.5 h-10.5 bg-[#203972] rounded-full flex items-center justify-center mr-2">
          <img src={SKLogo} className="w-10 h-10" />
        </div>
        <span className="text-2xl font-bold text-[#203972] font-serif tracking-tight">
          OpenSK Registration
        </span>
      </div>

      <div className="w-full max-w-2xl">
        <StepIndicator
          currentStep={currentStep}
          totalSteps={totalSteps}
          labels={["Personal Info", "Role & Barangay", "Documents", "Review"]}
        />

        <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100 relative min-h-[500px] flex flex-col">
          <div className="p-8">
            <AnimatePresence mode="wait">
              {currentStep === 1 && (
                <FormStep
                  key="step1"
                  title="Personal Information"
                  description="Let's start with your details"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors"
                        placeholder="Juan"
                      />
                    </div>
                    <div className="col-span-2 md:col-span-1">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors"
                        placeholder="Dela Cruz"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors"
                        placeholder="juan.delacruz@sk.gov.ph"
                      />
                    </div>
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors"
                        placeholder="+63 900 000 0000"
                      />
                    </div>
                  </div>
                </FormStep>
              )}

              {currentStep === 2 && (
                <FormStep
                  key="step2"
                  title="Role & Barangay"
                  description="Define your official designation"
                >
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Official Role
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors bg-white">
                        <option>SK Chairperson</option>
                        <option>SK Kagawad</option>
                        <option>SK Secretary</option>
                        <option>SK Treasurer</option>
                      </select>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Province
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors bg-white">
                          <option>Select Province</option>
                          <option>Cebu</option>
                          <option>Manila</option>
                          <option>Davao</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City / Municipality
                        </label>
                        <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors bg-white">
                          <option>Select City</option>
                          <option>Cebu City</option>
                          <option>Mandaue City</option>
                          <option>Lapu-Lapu City</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barangay
                      </label>
                      <select className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-[#203972] focus:border-[#203972] outline-none transition-colors bg-white">
                        <option>Select Barangay</option>
                        <option>Barangay Pari-an</option>
                        <option>Barangay Zapatera</option>
                        <option>Barangay Kamagayan</option>
                      </select>
                    </div>
                  </div>
                </FormStep>
              )}

              {currentStep === 3 && (
                <FormStep
                  key="step3"
                  title="Verification Documents"
                  description="Upload proof of your appointment"
                >
                  <div className="space-y-6">
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#203972] transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                      <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center rounded-full bg-white mb-4 shadow-sm">
                        <Upload className="h-6 w-6 text-[#203972]" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Upload Government ID
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF up to 5MB
                      </p>
                    </div>

                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#203972] transition-colors cursor-pointer bg-gray-50 hover:bg-blue-50">
                      <div className="mx-auto h-12 w-12 text-gray-400 flex items-center justify-center rounded-full bg-white mb-4 shadow-sm">
                        <FileText className="h-6 w-6 text-[#203972]" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Upload Oath of Office
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        PNG, JPG, PDF up to 5MB
                      </p>
                    </div>
                  </div>
                </FormStep>
              )}

              {currentStep === 4 && (
                <FormStep
                  key="step4"
                  title="Review Registration"
                  description="Please verify your information"
                >
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-100">
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-[#203972] mt-0.5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          Full Name
                        </p>
                        <p className="font-medium text-gray-900">
                          Juan Dela Cruz
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200 w-full" />
                    <div className="flex items-start">
                      <Building2 className="w-5 h-5 text-[#203972] mt-0.5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          Designation
                        </p>
                        <p className="font-medium text-gray-900">
                          SK Chairperson • Barangay Pari-an, Cebu City
                        </p>
                      </div>
                    </div>
                    <div className="h-px bg-gray-200 w-full" />
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-[#203972] mt-0.5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase tracking-wide font-semibold">
                          Documents
                        </p>
                        <p className="font-medium text-gray-900">
                          Government_ID.jpg, Oath_Office.pdf
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start p-4 bg-blue-50 rounded-md mt-4">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-[#203972] border-gray-300 rounded focus:ring-[#203972]"
                    />
                    <label className="ml-3 block text-sm text-gray-700">
                      I certify that the information provided is true and
                      correct, and I agree to the{" "}
                      <a href="#" className="text-[#203972] underline">
                        Terms of Service
                      </a>{" "}
                      and{" "}
                      <a href="#" className="text-[#203972] underline">
                        Privacy Policy
                      </a>
                      .
                    </label>
                  </div>
                </FormStep>
              )}
            </AnimatePresence>
          </div>

          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                currentStep === 1
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-[#203972] hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <motion.button
              whileHover={{
                scale: 1.02,
              }}
              whileTap={{
                scale: 0.98,
              }}
              onClick={nextStep}
              className="flex items-center px-6 py-2 bg-[#db1d34] text-white rounded-md font-medium shadow-sm hover:bg-[#b9182b] transition-colors"
            >
              {currentStep === totalSteps ? "Submit Registration" : "Next Step"}
              {currentStep !== totalSteps && (
                <ChevronRight className="w-4 h-4 ml-1" />
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
