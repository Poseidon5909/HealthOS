import useAuthStore from '../../store/authStore';

function Profile() {
  const { user } = useAuthStore();

  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">👤</span>
          Profile
        </h1>
        <p className="text-gray-600 mt-2">Manage your account and preferences</p>
      </div>

      {/* User Info Preview */}
      <div className="bg-white rounded-lg shadow-md p-8">
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-lg">
            {user?.name?.charAt(0).toUpperCase() || 'U'}
          </div>
          <div className="ml-6">
            <h2 className="text-2xl font-bold text-gray-900">{user?.name || 'User'}</h2>
            <p className="text-gray-600">{user?.email || 'user@example.com'}</p>
          </div>
        </div>
        <div className="border-t pt-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Account Status</h3>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Status:</span> <span className="text-green-600">Active</span></p>
            <p><span className="font-medium">Email Verified:</span> <span className="text-gray-600">{user?.email_verified ? 'Yes' : 'Pending'}</span></p>
            <p><span className="font-medium">Role:</span> <span className="text-gray-600">{user?.role || 'User'}</span></p>
          </div>
        </div>
        <div className="mt-6 text-sm text-indigo-600 font-medium">Full profile editor coming in Day 10+</div>
      </div>
    </div>
  );
}

export default Profile;
