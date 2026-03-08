import { useNavigate } from 'react-router-dom';
import useAuthStore from '../../store/authStore';

function Dashboard() {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">HealthOS Dashboard</h1>
            <p className="text-sm text-gray-600">Welcome back!</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Grid of placeholder cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Nutrition</h3>
            <p className="text-gray-600">Track your daily calorie intake and macros</p>
            <div className="mt-4 text-sm text-gray-500">Coming in Day 3</div>
          </div>

          {/* Card 2 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💪 Workouts</h3>
            <p className="text-gray-600">Log your exercises and track progress</p>
            <div className="mt-4 text-sm text-gray-500">Coming in Day 4</div>
          </div>

          {/* Card 3 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">💧 Hydration</h3>
            <p className="text-gray-600">Monitor your daily water intake</p>
            <div className="mt-4 text-sm text-gray-500">Coming in Day 5</div>
          </div>

          {/* Card 4 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Progress</h3>
            <p className="text-gray-600">View your weight trends and consistency</p>
            <div className="mt-4 text-sm text-gray-500">Coming in Day 6</div>
          </div>

          {/* Card 5 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ Habits</h3>
            <p className="text-gray-600">Build and track healthy habits</p>
            <div className="mt-4 text-sm text-gray-500">Coming in Day 7</div>
          </div>

          {/* Card 6 */}
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Goals</h3>
            <p className="text-gray-600">Set and achieve your fitness targets</p>
            <div className="mt-4 text-sm text-gray-500">Coming in Day 8</div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
