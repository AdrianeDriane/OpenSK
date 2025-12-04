import { Building2, Facebook, Twitter, Mail } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#1a2e5a] text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-3">
                <Building2 className="w-6 h-6 text-[#203972]" />
              </div>
              <span className="text-2xl font-bold font-serif tracking-wide">
                OpenSK
              </span>
            </div>
            <p className="text-blue-100 max-w-md mb-6 leading-relaxed">
              The official transparency and engagement platform for Sangguniang
              Kabataan. Empowering youth leaders with digital tools for better
              governance.
            </p>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-blue-200 hover:text-white transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif border-b border-blue-800 pb-2 inline-block">
              Platform
            </h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  About OpenSK
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Features
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For Officials
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  For Citizens
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-6 font-serif border-b border-blue-800 pb-2 inline-block">
              Legal & Support
            </h3>
            <ul className="space-y-3 text-blue-100">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-blue-900 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-blue-300">
          <p>&copy; {new Date().getFullYear()} OpenSK. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for the Filipino Youth.</p>
        </div>
      </div>
    </footer>
  );
}
