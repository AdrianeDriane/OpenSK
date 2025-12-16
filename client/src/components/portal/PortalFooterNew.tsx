import { Facebook, Twitter, Mail } from "lucide-react";
import SKLogo from "../../assets/icons/sk_logo.png";

interface PortalFooterNewProps {
  barangayName: string;
}

export const PortalFooterNew = ({ barangayName }: PortalFooterNewProps) => {
  const year = new Date().getFullYear();

  return (
    <footer
      className="pb-8 pt-16 text-white"
      style={{ backgroundColor: "var(--color-secondary)" }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 grid grid-cols-1 gap-12 md:grid-cols-4">
          <div className="col-span-1 md:col-span-2">
            <div className="mb-6 flex items-center">
              <div
                className="mr-3 flex h-10 w-10 items-center justify-center rounded-full"
                style={{ backgroundColor: "var(--color-accent)" }}
              >
                <img src={SKLogo} alt="SK Logo" className="h-9 w-9" />
              </div>
              <span
                className="text-2xl font-bold tracking-wide"
                style={{ fontFamily: "var(--font-heading)" }}
              >
                OpenSK
              </span>
            </div>
            <p
              className="mb-6 max-w-md leading-relaxed text-blue-100"
              style={{ fontFamily: "var(--font-body)" }}
            >
              The official transparency and engagement platform for Sangguniang
              Kabataan. Empowering youth leaders with digital tools for better
              governance.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-200 transition-colors hover:text-white"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 transition-colors hover:text-white"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 transition-colors hover:text-white"
              >
                <Mail className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h3
              className="mb-6 inline-block border-b border-blue-800 pb-2 font-serif text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Platform
            </h3>
            <ul
              className="space-y-3 text-blue-100"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  About OpenSK
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  For Officials
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  For Citizens
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3
              className="mb-6 inline-block border-b border-blue-800 pb-2 font-serif text-lg font-semibold"
              style={{ fontFamily: "var(--font-heading)" }}
            >
              Legal & Support
            </h3>
            <ul
              className="space-y-3 text-blue-100"
              style={{ fontFamily: "var(--font-body)" }}
            >
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-white">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div
          className="flex flex-col items-center justify-between border-t border-blue-900 pt-8 text-sm text-blue-300 md:flex-row"
          style={{ fontFamily: "var(--font-body)" }}
        >
          <p>
            © {year} Sangguniang Kabataan Barangay {barangayName}. All rights
            reserved.
          </p>
          <p className="mt-2 md:mt-0">Built for the Filipino Youth.</p>
        </div>
      </div>
    </footer>
  );
};
