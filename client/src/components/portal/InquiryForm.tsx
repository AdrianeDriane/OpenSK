import { Send } from "lucide-react";

export const InquiryForm = () => {
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

      <form className="space-y-6">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <div className="relative">
            <input
              type="text"
              id="name"
              className="peer w-full rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white placeholder-transparent transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
              placeholder="Name"
              style={{ fontFamily: "var(--font-body)" }}
            />
            <label
              htmlFor="name"
              className="pointer-events-none absolute left-4 top-3 text-sm text-blue-200 transition-all peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-blue-200/70 peer-focus:-top-2.5 peer-focus:bg-[var(--color-primary)] peer-focus:px-1 peer-focus:text-xs peer-focus:text-white peer-not-placeholder-shown:-top-2.5 peer-not-placeholder-shown:bg-[var(--color-primary)] peer-not-placeholder-shown:px-1 peer-not-placeholder-shown:text-xs peer-not-placeholder-shown:text-white"
              style={{ fontFamily: "var(--font-body)" }}
            >
              Full Name
            </label>
          </div>
          <div className="relative">
            <input
              type="email"
              id="email"
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
            className="peer w-full appearance-none rounded-lg border border-white/20 bg-white/10 px-4 py-3 text-white transition-all focus:border-transparent focus:outline-none focus:ring-2 focus:ring-[var(--color-accent)]"
            style={{ fontFamily: "var(--font-body)" }}
          >
            <option value="" className="text-gray-900">
              Select a topic
            </option>
            <option value="inquiry" className="text-gray-900">
              General Inquiry
            </option>
            <option value="complaint" className="text-gray-900">
              Complaint/Concern
            </option>
            <option value="suggestion" className="text-gray-900">
              Suggestion
            </option>
            <option value="document" className="text-gray-900">
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
            rows={4}
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
          className="flex w-full items-center justify-center rounded-lg py-4 font-bold text-white shadow-lg transition-colors hover:opacity-90"
          style={{
            backgroundColor: "var(--color-accent)",
            fontFamily: "var(--font-body)",
          }}
        >
          Send Message
          <Send className="ml-2 h-5 w-5" />
        </button>
      </form>
    </div>
  );
};
