import { motion } from "framer-motion";
import { FormStep } from "../registerBarangayPage/FormStep";
import { ShieldCheck } from "lucide-react";

import SKLogo from "../../assets/icons/sk_logo.png";

export function LoginPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 font-sans">
      {/* Header Logo */}
      <div className="mb-8 flex items-center">
        <div className="w-10.5 h-10.5 bg-[#203972] rounded-full flex items-center justify-center mr-2">
          <img src={SKLogo} className="w-10 h-10" />
        </div>
        <span className="text-2xl font-bold text-[#203972] font-serif tracking-tight">
          OpenSK
        </span>
      </div>

      <div className="w-full max-w-md bg-white rounded-xl shadow-xl overflow-hidden border border-gray-100">
        <div className="p-8">
          <div className="">
            <FormStep
              title="Secure Login"
              description="Access your official barangay portal"
            >
              <div className="space-y-4 mt-6">
                <motion.button
                  onClick={() => {
                    window.location.href =
                      "http://localhost:4000/api/auth/google";
                  }}
                  whileHover={{
                    scale: 1.02,
                    backgroundColor: "#f9fafb",
                  }}
                  whileTap={{
                    scale: 0.98,
                  }}
                  className="w-full flex items-center justify-center px-4 py-3 border border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 font-medium hover:bg-gray-50 transition-colors"
                >
                  <svg className="h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <path
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      fill="#4285F4"
                    />
                    <path
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      fill="#34A853"
                    />
                    <path
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      fill="#FBBC05"
                    />
                    <path
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      fill="#EA4335"
                    />
                  </svg>
                  Continue with Google
                </motion.button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                      Official SK Accounts Only
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 p-4 rounded-lg flex items-start">
                  <ShieldCheck className="w-5 h-5 text-[#203972] mt-0.5 mr-3 " />
                  <p className="text-sm text-[#203972]">
                    For security, please use your official government-issued
                    email address if available.
                  </p>
                </div>
              </div>
            </FormStep>
          </div>
        </div>

        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 text-center">
          <p className="text-sm text-gray-500">
            Don't have an account yet?{" "}
            <a href="#" className="text-[#db1d34] font-medium hover:underline">
              Register with Google.
            </a>
          </p>
        </div>
      </div>

      <footer className="mt-12 text-center text-sm text-gray-400">
        <p>© 2025 OpenSK. Official Transparency Portal.</p>
      </footer>
    </div>
  );
}
