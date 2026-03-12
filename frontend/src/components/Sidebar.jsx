import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  BookOpen, 
  Dumbbell, 
  Droplets, 
  Target,
  TrendingUp, 
  CheckSquare, 
  User, 
  LogOut 
} from 'lucide-react';
import useAuthStore from '../store/authStore';

/**
 * Sidebar Component
 * 
 * Purpose:
 * Provides consistent navigation across the entire application.
 * 
 * Why this is reusable:
 * - Used on every protected page
 * - Single source of truth for navigation
 * - Easy to add/remove navigation items
 * 
 * Navigation Items:
 * Each has an icon, label, and route path.
 * Using NavLink for active state styling.
 */
function Sidebar() {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  // Navigation configuration
  const navigationItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
    { icon: BookOpen, label: 'Diary', path: '/diary' },
    { icon: Dumbbell, label: 'Workouts', path: '/workouts' },
    { icon: Droplets, label: 'Hydration', path: '/hydration' },
    { icon: Target, label: 'Nutrition', path: '/nutrition' },
    { icon: TrendingUp, label: 'Progress', path: '/progress' },
    { icon: CheckSquare, label: 'Habits', path: '/habits' },
    { icon: User, label: 'Profile', path: '/profile' },
  ];

  return (
    <aside className="fixed left-0 top-0 h-full w-64 bg-gradient-to-b from-indigo-600 to-purple-700 text-white shadow-2xl z-30">
      {/* Logo Section */}
      <div className="p-6 border-b border-white/20">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl backdrop-blur">
            ❤️
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight">HealthOS</h1>
            <p className="text-xs text-white/70">Your Health Hub</p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="p-4 space-y-1">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-white text-indigo-600 font-semibold shadow-lg'
                    : 'text-white/80 hover:bg-white/10 hover:text-white'
                }`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Logout Button */}
      <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
        <button
          onClick={handleLogout}
          className="flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-white/80 hover:bg-red-500 hover:text-white w-full"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;
