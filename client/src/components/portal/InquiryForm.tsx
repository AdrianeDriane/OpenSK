import { Send } from "lucide-react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";

export const InquiryForm = () => {
  const { slug } = useParams();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    subject: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!slug) {
      setSubmitStatus({
        type: "error",
        message: "Unable to determine barangay. Please refresh the page.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      await api.post("/inquiries/submit", {
        ...formData,
        barangaySlug: slug,
      });

      setSubmitStatus({
        type: "success",
        message: "Inquiry submitted successfully! We will respond soon.",
      });
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        subject: "",
        message: "",
      });
    } catch (error: unknown) {
      const errorMessage =
        (error as { response?: { data?: { error?: string } } })?.response?.data
          ?.error || "Failed to submit inquiry. Please try again.";
      setSubmitStatus({
        type: "error",
        message: errorMessage,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div
      className="rounded-2xl p-8 text-white shadow-xl md:p-12"
      style={{ backgroundColor: "var(--color-primary)" }}
    >
      <div className="mb-10 text-center">
        <h2
          className="mb-4 text-3xl font-bold"
          style={{ fontFamily: "var(--font-heading)" }}
        >
          Send Us an Inquiry
        </h2>
        <p className="text-blue-100" style={{ fontFamily: "var(--font-body)" }}>
          Have questions, suggestions, or concerns? We're here to listen and
          serve.
        </p>
      </div>

      {submitStatus.type && (
        <div
          className={`mb-6 rounded-lg p-4 text-center ${
            submitStatus.type === "success"
              ? "bg-green-500/20 text-green-100"
              : "bg-red-500/20 text-red-100"
          }`}
        >
          {submitStatus.message}
        </div>
      )}

      <form className="space-y-6" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              required
              className="peer w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-transparent transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="First Name"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <label
              htmlFor="firstName"
              className="pointer-events-none absolute left-4 top-3 text-sm text-blue-200 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-200/70 peer-focus:-top-2.5 peer-focus:bg-[var(--color-primary)] peer-focus:px-1 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[var(--color-primary)] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              First Name
            </label>
          </div>
          <div className="relative">
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              required
              className="peer w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-transparent transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="Last Name"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <label
              htmlFor="lastName"
              className="pointer-events-none absolute left-4 top-3 text-sm text-blue-200 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-200/70 peer-focus:-top-2.5 peer-focus:bg-[var(--color-primary)] peer-focus:px-1 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[var(--color-primary)] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Last Name
            </label>
          </div>
          <div className="relative">
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className="peer w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-transparent transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="Email"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <label
              htmlFor="email"
              className="pointer-events-none absolute left-4 top-3 text-sm text-blue-200 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-200/70 peer-focus:-top-2.5 peer-focus:bg-[var(--color-primary)] peer-focus:px-1 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[var(--color-primary)] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Email Address
            </label>
          </div>
        </div>

        <div className="relative">
          <select
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="peer w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <option value="" className="text-gray-900">
              Select a topic
            </option>
            <option value="General Inquiry" className="text-gray-900">
              General Inquiry
            </option>
            <option value="Complaint" className="text-gray-900">
              Complaint/Concern
            </option>
            <option value="Suggestion" className="text-gray-900">
              Suggestion
            </option>
            <option value="Document Request" className="text-gray-900">
              Document Request
            </option>
          </select>
          <label
            htmlFor="subject"
            className="absolute -top-2.5 left-4 bg-[var(--color-primary)] px-1 text-xs text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Subject
          </label>
        </div>

        <div className="relative">
          <textarea
            id="message"
            name="message"
            rows={4}
            value={formData.message}
            onChange={handleChange}
            required
            className="peer w-full resize-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-transparent transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            placeholder="Message"
            style={{ fontFamily: "var(--font-body)" }}
          ></textarea>
          <label
            htmlFor="message"
            className="pointer-events-none absolute left-4 top-3 text-sm text-blue-200 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-200/70 peer-focus:-top-2.5 peer-focus:bg-[var(--color-primary)] peer-focus:px-1 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[var(--color-primary)] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
            style={{ fontFamily: "var(--font-body)" }}
          >
            Your Message
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="flex w-full items-center justify-center rounded-lg py-4 font-bold text-white shadow-lg transition-colors hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
          style={{
            backgroundColor: "var(--color-accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          {isSubmitting ? "Submitting..." : "Send Message"}
          {!isSubmitting && <Send className="ml-2 h-5 w-5" />}
        </button>
      </form>
    </div>
  );
};
