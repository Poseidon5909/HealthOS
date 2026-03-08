import useAuthStore from '../../store/authStore';

function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">Welcome back, {user?.name || 'User'}!</p>
      </div>

      {/* Grid of placeholder cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📊 Nutrition</h3>
          <p className="text-gray-600">Track your daily calorie intake and macros</p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">Coming in Day 5+</div>
        </div>

        {/* Card 2 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💪 Workouts</h3>
          <p className="text-gray-600">Log your exercises and track progress</p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">Coming in Day 6+</div>
        </div>

        {/* Card 3 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">💧 Hydration</h3>
          <p className="text-gray-600">Monitor your daily water intake</p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">Coming in Day 7+</div>
        </div>

        {/* Card 4 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">📈 Progress</h3>
          <p className="text-gray-600">View your weight trends and consistency</p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">Coming in Day 8+</div>
        </div>

        {/* Card 5 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">✅ Habits</h3>
          <p className="text-gray-600">Build and track healthy habits</p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">Coming in Day 9+</div>
        </div>

        {/* Card 6 */}
        <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
          <h3 className="text-lg font-semibold text-gray-800 mb-2">🎯 Goals</h3>
          <p className="text-gray-600">Set and achieve your fitness targets</p>
          <div className="mt-4 text-sm text-indigo-600 font-medium">Coming in Day 10+</div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
