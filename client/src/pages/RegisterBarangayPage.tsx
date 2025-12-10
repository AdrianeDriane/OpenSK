import { useState, useEffect } from "react";
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
import api from "../api/axios";
import toast from "react-hot-toast";

interface AuthUser {
  id: number;
  email: string;
  roleId: number;
  verified: boolean;
  firstName: string;
  lastName: string;
  googleId: string;
  barangayId: number | null;
  iat: number;
  exp: number;
}

interface Barangay {
  id: number;
  name: string;
}

interface RegistrationForm {
  firstName: string;
  lastName: string;
  email: string;
  mobileNumber: string;
  role: string;
  province: string;
  city: string;
  barangayId: number | null;
  remarks: string;

  governmentIdFile: File | null;
  oathOfOfficeFile: File | null;
}

export function RegisterBarangayPage() {
  const [authUser, setAuthUser] = useState<AuthUser | null>(null);
  const [barangays, setBarangays] = useState<Barangay[]>([]);

  const [form, setForm] = useState<RegistrationForm>({
    firstName: "",
    lastName: "",
    email: "",
    mobileNumber: "",
    role: "SK Chairperson",
    province: "Cebu",
    city: "Cebu City",
    barangayId: null,
    remarks: "",
    governmentIdFile: null,
    oathOfOfficeFile: null,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  // Decode token & load auth user
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (!token) return;

    const payload: AuthUser = JSON.parse(atob(token.split(".")[1]));

    if (payload.verified) {
      window.location.href = "/dashboard";
    }

    setAuthUser(payload);
    console.log(authUser);

    // Sync form with authUser
    setForm((prev) => ({
      ...prev,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Fetch barangays from backend
  useEffect(() => {
    api
      .get("/api/barangays")
      .then((res) => {
        setBarangays(res.data.data);
      })
      .catch((err) => console.error("Error fetching barangays:", err));
  }, []);

  const nextStep = () =>
    currentStep < totalSteps && setCurrentStep((s) => s + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleSubmit = () => {
    if (!form.barangayId) {
      toast.error("Please select a barangay.");
      return;
    }

    api
      .patch("/api/verify/bypass", {
        barangayId: form.barangayId,
      })
      .then((res) => {
        // 1️⃣ Update localStorage so ProtectedRoute won't block
        localStorage.setItem("auth_user", JSON.stringify(res.data.user));
        localStorage.setItem("auth_token", res.data.token);

        toast.success("Registration complete! Redirecting...");

        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1200);
      })
      .catch((err) => {
        console.error(err);
        toast.error("Something went wrong while saving your registration.");
      });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center py-12 px-4 font-sans">
      {/* Header */}
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
              {/* STEP 1 — PERSONAL INFO */}
              {currentStep === 1 && (
                <FormStep
                  key="step1"
                  title="Personal Information"
                  description="Let's start with your details"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* First Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        value={form.firstName}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Last Name */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={form.lastName}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Email */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={form.email}
                        disabled
                        className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                      />
                    </div>

                    {/* Mobile Number */}
                    <div className="col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Mobile Number
                      </label>
                      <input
                        type="tel"
                        value={form.mobileNumber}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            mobileNumber: e.target.value,
                          }))
                        }
                        placeholder="+63 900 000 0000"
                        className="w-full px-4 py-2 border rounded-md focus:ring-[#203972] focus:border-[#203972]"
                      />
                    </div>
                  </div>
                </FormStep>
              )}

              {/* STEP 2 — ROLE & BARANGAY */}
              {currentStep === 2 && (
                <FormStep
                  key="step2"
                  title="Role & Barangay"
                  description="Define your official designation"
                >
                  <div className="space-y-6">
                    {/* Role */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Official Role
                      </label>
                      <select
                        value={form.role}
                        onChange={(e) =>
                          setForm((prev) => ({ ...prev, role: e.target.value }))
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      >
                        <option>SK Chairperson</option>
                        <option>SK Councilor</option>
                        <option>SK Secretary</option>
                        <option>SK Treasurer</option>
                      </select>
                    </div>

                    {/* Province & City */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Province
                        </label>
                        <select
                          value={form.province}
                          disabled
                          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                        >
                          <option>Cebu</option>
                        </select>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          City / Municipality
                        </label>
                        <select
                          value={form.city}
                          disabled
                          className="w-full px-4 py-2 border rounded-md bg-gray-100 text-gray-500 cursor-not-allowed"
                        >
                          <option>Cebu City</option>
                        </select>
                      </div>
                    </div>

                    {/* Barangay */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Barangay
                      </label>
                      <select
                        value={form.barangayId || ""}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            barangayId: Number(e.target.value),
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-md"
                      >
                        <option value="">Select Barangay</option>
                        {barangays.map((b) => (
                          <option key={b.id} value={b.id}>
                            {b.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Additional Remarks */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Additional Remarks
                      </label>
                      <textarea
                        value={form.remarks}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            remarks: e.target.value,
                          }))
                        }
                        rows={3}
                        className="w-full px-4 py-2 border rounded-md"
                      />
                    </div>
                  </div>
                </FormStep>
              )}

              {/* STEP 3 — DOCUMENT UPLOADS */}
              {currentStep === 3 && (
                <FormStep
                  key="step3"
                  title="Verification Documents"
                  description="Upload proof of your appointment"
                >
                  <div className="space-y-6">
                    {/* Government ID Upload */}
                    <input
                      type="file"
                      id="gov-id-upload"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          governmentIdFile: e.target.files?.[0] || null,
                        }))
                      }
                    />

                    <label
                      htmlFor="gov-id-upload"
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#203972] bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                        <Upload className="h-6 w-6 text-[#203972]" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Upload Government ID
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {form.governmentIdFile
                          ? `Selected: ${form.governmentIdFile.name}`
                          : "PNG, JPG, PDF up to 5MB"}
                      </p>
                    </label>

                    {/* Oath of Office Upload */}
                    <input
                      type="file"
                      id="oath-upload"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={(e) =>
                        setForm((prev) => ({
                          ...prev,
                          oathOfOfficeFile: e.target.files?.[0] || null,
                        }))
                      }
                    />

                    <label
                      htmlFor="oath-upload"
                      className="block border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-[#203972] bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                    >
                      <div className="mx-auto h-12 w-12 bg-white rounded-full flex items-center justify-center shadow-sm mb-3">
                        <FileText className="h-6 w-6 text-[#203972]" />
                      </div>
                      <h3 className="text-sm font-medium text-gray-900">
                        Upload Oath of Office
                      </h3>
                      <p className="text-xs text-gray-500 mt-1">
                        {form.oathOfOfficeFile
                          ? `Selected: ${form.oathOfOfficeFile.name}`
                          : "PNG, JPG, PDF up to 5MB"}
                      </p>
                    </label>
                  </div>
                </FormStep>
              )}

              {/* STEP 4 — REVIEW */}
              {currentStep === 4 && (
                <FormStep
                  key="step4"
                  title="Review Registration"
                  description="Please verify your information"
                >
                  <div className="bg-gray-50 rounded-lg p-6 space-y-4 border border-gray-100">
                    {/* Name */}
                    <div className="flex items-start">
                      <User className="w-5 h-5 text-[#203972] mt-0.5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                          Full Name
                        </p>
                        <p className="font-medium text-gray-900">
                          {form.firstName} {form.lastName}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full" />

                    {/* Role + Barangay */}
                    <div className="flex items-start">
                      <Building2 className="w-5 h-5 text-[#203972] mt-0.5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                          Designation
                        </p>
                        <p className="font-medium text-gray-900">
                          {form.role} • Barangay{" "}
                          {
                            barangays.find((b) => b.id === form.barangayId)
                              ?.name
                          }
                          , Cebu City
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full" />

                    {/* Documents */}
                    <div className="flex items-start">
                      <FileText className="w-5 h-5 text-[#203972] mt-0.5 mr-3" />
                      <div>
                        <p className="text-xs text-gray-500 uppercase font-semibold">
                          Documents
                        </p>
                        <p className="font-medium text-gray-900">
                          {form.governmentIdFile?.name ||
                            "No Government ID uploaded"}
                          ,{" "}
                          {form.oathOfOfficeFile?.name ||
                            "No Oath of Office uploaded"}
                        </p>
                      </div>
                    </div>

                    <div className="h-px bg-gray-200 w-full" />

                    {/* Remarks */}
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">
                        Additional Remarks
                      </p>
                      <p className="font-medium text-gray-900">
                        {form.remarks || "None"}
                      </p>
                    </div>
                  </div>

                  {/* Agreement */}
                  <div className="flex items-start p-4 bg-blue-50 rounded-md mt-4">
                    <input
                      type="checkbox"
                      className="mt-1 h-4 w-4 text-[#203972] border-gray-300 rounded"
                    />
                    <label className="ml-3 text-sm text-gray-700">
                      I certify the information provided is true and correct,
                      and I agree to the{" "}
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

          {/* Footer Navigation */}
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
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={currentStep === totalSteps ? handleSubmit : nextStep}
              className="flex items-center px-6 py-2 bg-[#db1d34] text-white rounded-md font-medium shadow-sm hover:bg-[#b9182b]"
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
