import { Shield, LogOut } from "lucide-react";

interface AdminHeaderProps {
  user: {
    firstName: string;
    lastName: string;
  } | null;
  onLogout: () => void;
}

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-[#203972] rounded-lg flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-[#203972]">OpenSK Admin</h1>
              <p className="text-xs text-gray-500">Administration Panel</p>
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-600">
                {user.firstName} {user.lastName}
              </span>
            )}
            <button
              onClick={onLogout}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 hover:text-[#db1d34] hover:bg-gray-100 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
