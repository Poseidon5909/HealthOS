function Habits() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">✅</span>
          Habits
        </h1>
        <p className="text-gray-600 mt-2">Build and track healthy habits</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🎯</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Habit Tracking Coming Soon</h2>
        <p className="text-gray-600">This feature will help you build and maintain healthy habits with streak tracking.</p>
        <div className="mt-6 text-sm text-indigo-600 font-medium">Implementation coming in Day 9+</div>
      </div>
    </div>
  );
}

export default Habits;
