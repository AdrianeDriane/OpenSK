import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StepIndicator } from "../components/registerBarangayPage/StepIndicator";
import { FormStep } from "../components/registerBarangayPage/FormStep";
import { PendingVerification } from "../components/registerBarangayPage/PendingVerification";
import {
  ChevronRight,
  ChevronLeft,
  Upload,
  FileText,
  Building2,
  User,
  Loader2,
} from "lucide-react";
import { AxiosError } from "axios";

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

interface VerificationRequest {
  id: number;
  status: { name: string };
  submittedAt: string;
  remarks: string | null;
  rejectionReason: string | null;
  barangay: { id: number; name: string } | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
  documents: Array<{
    id: number;
    fileUrl: string;
    type: { name: string };
  }>;
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
  // Document fields
  validIdFile: File | null;
  supportingDocType: string; // "Certificate of Incumbency" | "Certificate of Proclamation" | "Oath of Office"
  supportingDocFile: File | null;
}

export function RegisterBarangayPage() {
  const [barangays, setBarangays] = useState<Barangay[]>([]);
  const [existingRequest, setExistingRequest] =
    useState<VerificationRequest | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

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
    validIdFile: null,
    supportingDocType: "Certificate of Incumbency",
    supportingDocFile: null,
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
      return;
    }

    // Sync form with authUser
    setForm((prev) => ({
      ...prev,
      firstName: payload.firstName,
      lastName: payload.lastName,
      email: payload.email,
    }));
  }, []);

  // Fetch existing verification request
  useEffect(() => {
    const checkExistingRequest = async () => {
      try {
        const res = await api.get("/verification-requests/me");
        if (res.data.request) {
          setExistingRequest(res.data.request);
        }
      } catch (err) {
        console.error("Error checking verification status:", err);
      } finally {
        setIsLoading(false);
      }
    };

    checkExistingRequest();
  }, []);

  // Fetch barangays from backend
  useEffect(() => {
    api
      .get("/barangays")
      .then((res) => {
        setBarangays(res.data.data);
      })
      .catch((err) => console.error("Error fetching barangays:", err));
  }, []);

  const nextStep = () =>
    currentStep < totalSteps && setCurrentStep((s) => s + 1);
  const prevStep = () => currentStep > 1 && setCurrentStep((s) => s - 1);

  const handleSubmit = async () => {
    // Validation
    if (!form.barangayId) {
      toast.error("Please select a barangay.");
      return;
    }
    if (!form.validIdFile) {
      toast.error("Please upload a Valid ID.");
      return;
    }
    if (!form.supportingDocFile) {
      toast.error("Please upload a supporting document.");
      return;
    }
    if (!agreedToTerms) {
      toast.error("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    setIsSubmitting(true);

    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append("barangayId", String(form.barangayId));
      formData.append("mobileNumber", form.mobileNumber);
      formData.append("role", form.role);
      formData.append("remarks", form.remarks);
      formData.append("validId", form.validIdFile);
      formData.append("supportingDocType", form.supportingDocType);
      formData.append("supportingDoc", form.supportingDocFile);

      const res = await api.post("/verification-requests", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Registration submitted successfully!");
      setExistingRequest(res.data.request);
    } catch (err: unknown) {
      console.error(err);
      const axiosError = err as AxiosError<{ error: string }>;
      const message =
        axiosError.response?.data?.error ||
        "Something went wrong while submitting.";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#203972]" />
      </div>
    );
  }

  // Show pending verification screen if request exists (and not resubmitting)
  if (existingRequest) {
    return (
      <PendingVerification
        request={existingRequest}
        onRequestUpdate={(updatedRequest) => setExistingRequest(updatedRequest)}
      />
    );
  }

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
                    {/* Valid ID Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Valid Government ID{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="valid-id-upload"
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            validIdFile: e.target.files?.[0] || null,
                          }))
                        }
                      />
                      <label
                        htmlFor="valid-id-upload"
                        className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#203972] bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="mx-auto h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                          <Upload className="h-5 w-5 text-[#203972]" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Upload Valid ID
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {form.validIdFile
                            ? `✓ ${form.validIdFile.name}`
                            : "PNG, JPG, PDF up to 5MB"}
                        </p>
                      </label>
                    </div>

                    {/* Supporting Document Type Dropdown */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Supporting Document Type{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        value={form.supportingDocType}
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            supportingDocType: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-2 border rounded-md focus:ring-[#203972] focus:border-[#203972]"
                      >
                        <option value="Certificate of Incumbency">
                          Certificate of Incumbency
                        </option>
                        <option value="Certificate of Proclamation">
                          Certificate of Proclamation
                        </option>
                        <option value="Oath of Office">Oath of Office</option>
                      </select>
                    </div>

                    {/* Supporting Document Upload */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Upload {form.supportingDocType}{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="file"
                        id="supporting-doc-upload"
                        accept=".png,.jpg,.jpeg,.pdf"
                        className="hidden"
                        onChange={(e) =>
                          setForm((prev) => ({
                            ...prev,
                            supportingDocFile: e.target.files?.[0] || null,
                          }))
                        }
                      />
                      <label
                        htmlFor="supporting-doc-upload"
                        className="block border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#203972] bg-gray-50 hover:bg-blue-50 cursor-pointer transition-colors"
                      >
                        <div className="mx-auto h-10 w-10 bg-white rounded-full flex items-center justify-center shadow-sm mb-2">
                          <FileText className="h-5 w-5 text-[#203972]" />
                        </div>
                        <h3 className="text-sm font-medium text-gray-900">
                          Upload {form.supportingDocType}
                        </h3>
                        <p className="text-xs text-gray-500 mt-1">
                          {form.supportingDocFile
                            ? `✓ ${form.supportingDocFile.name}`
                            : "PNG, JPG, PDF up to 5MB"}
                        </p>
                      </label>
                    </div>
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
                          {barangays.find((b) => b.id === form.barangayId)
                            ?.name || "Not selected"}
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
                        <ul className="text-sm text-gray-900 space-y-1">
                          <li>
                            {form.validIdFile
                              ? `✓ Valid ID: ${form.validIdFile.name}`
                              : "✗ Valid ID (missing)"}
                          </li>
                          <li>
                            {form.supportingDocFile
                              ? `✓ ${form.supportingDocType}: ${form.supportingDocFile.name}`
                              : `✗ ${form.supportingDocType} (missing)`}
                          </li>
                        </ul>
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
                      checked={agreedToTerms}
                      onChange={(e) => setAgreedToTerms(e.target.checked)}
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
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100 flex justify-between items-center mt-auto">
            <button
              onClick={prevStep}
              disabled={currentStep === 1 || isSubmitting}
              className={`flex items-center px-4 py-2 rounded-md font-medium transition-colors ${
                currentStep === 1 || isSubmitting
                  ? "text-gray-300 cursor-not-allowed"
                  : "text-gray-600 hover:text-[#203972] hover:bg-gray-100"
              }`}
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Back
            </button>

            <motion.button
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
              whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              onClick={currentStep === totalSteps ? handleSubmit : nextStep}
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-[#db1d34] text-white rounded-md font-medium shadow-sm hover:bg-[#b9182b] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Submitting...
                </>
              ) : currentStep === totalSteps ? (
                "Submit Registration"
              ) : (
                <>
                  Next Step
                  <ChevronRight className="w-4 h-4 ml-1" />
                </>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
}
