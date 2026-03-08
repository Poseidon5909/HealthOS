function Diary() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">📔</span>
          Food Diary
        </h1>
        <p className="text-gray-600 mt-2">Track your daily meals and nutrition</p>
      </div>

      {/* Placeholder Content */}
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-6xl mb-4">🍽️</div>
        <h2 className="text-xl font-semibold text-gray-800 mb-2">Food Diary Coming Soon</h2>
        <p className="text-gray-600">This feature will allow you to log your daily food intake and track nutrition.</p>
        <div className="mt-6 text-sm text-indigo-600 font-medium">Implementation coming in Day 5+</div>
      </div>
    </div>
  );
}

export default Diary;
