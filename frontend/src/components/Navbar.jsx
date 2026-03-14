import { Bell, Menu, Search } from 'lucide-react';
import useAuthStore from '../store/authStore';

/**
 * Navbar Component
 * 
 * Purpose:
 * Displays app branding, user information, and quick actions at the top of every page.
 * 
 * Features:
 * - Shows current user's name from auth store
 * - Search bar (placeholder for future)
 * - Notifications (placeholder for future)
 * - User avatar with first letter of name
 * 
 * Why at the top of every page:
 * - Consistent user context (who's logged in)
 * - Quick access to global features
 * - Professional app experience
 */
function Navbar({ onOpenMenu = () => {} }) {
  const { user } = useAuthStore();

  // Get user's first name or fallback to email
  const displayName = user?.name || user?.email || 'User';
  const firstName = displayName.split(' ')[0];
  
  // Get first letter for avatar
  const avatarLetter = displayName.charAt(0).toUpperCase();

  return (
    <nav className="sticky top-0 z-20 border-b border-gray-200 bg-white px-4 py-4 shadow-sm sm:px-6">
      <div className="flex items-center justify-between">
        <div className="mr-3 md:hidden">
          <button
            type="button"
            onClick={onOpenMenu}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-slate-200 text-slate-700 transition hover:bg-slate-100"
            aria-label="Open navigation"
          >
            <Menu size={20} />
          </button>
        </div>

        {/* Left side - Search */}
        <div className="hidden max-w-xl flex-1 items-center md:flex">
          <div className="relative w-full">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search... (coming soon)"
              disabled
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-50 disabled:cursor-not-allowed"
            />
          </div>
        </div>

        {/* Right side - User info */}
        <div className="ml-2 flex items-center space-x-3 sm:space-x-4 md:ml-6">
          {/* Notifications Bell */}
          <button
            className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors rounded-lg hover:bg-gray-100"
            title="Notifications (coming soon)"
            disabled
          >
            <Bell size={20} />
            {/* Notification badge (for future) */}
            {/* <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span> */}
          </button>

          {/* User Info */}
          <div className="flex items-center space-x-3 border-l border-gray-200 pl-3 sm:pl-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-gray-800">{firstName}</p>
              <p className="text-xs text-gray-500">{user?.email}</p>
            </div>
            
            {/* User Avatar */}
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold shadow-md">
              {avatarLetter}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
