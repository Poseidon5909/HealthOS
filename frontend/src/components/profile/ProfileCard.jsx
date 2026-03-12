import { format } from 'date-fns';

const formatDate = (dateValue) => {
  if (!dateValue) {
    return 'Unavailable';
  }

  const parsedDate = new Date(dateValue);

  if (Number.isNaN(parsedDate.getTime())) {
    return 'Unavailable';
  }

  return format(parsedDate, 'MMMM d, yyyy');
};

function ProfileCard({ profile }) {
  const initials = profile?.name?.charAt(0)?.toUpperCase() || 'U';
  const accountStatus = profile?.is_active ? 'Active' : 'Inactive';

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      <div className="bg-gradient-to-br from-sky-600 via-cyan-500 to-emerald-400 p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-2xl font-bold shadow-sm">
            {initials}
          </div>
          <div>
            <p className="text-sm uppercase tracking-[0.25em] text-white/70">Account Overview</p>
            <h2 className="text-2xl font-bold mt-1">{profile?.name || 'User'}</h2>
            <p className="text-sm text-white/80 mt-1">{profile?.email || 'No email available'}</p>
          </div>
        </div>
      </div>

      <div className="p-6 space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-slate-500">Account status</p>
            <p className={`mt-2 font-semibold ${profile?.is_active ? 'text-emerald-600' : 'text-amber-600'}`}>
              {accountStatus}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-slate-500">Email verification</p>
            <p className={`mt-2 font-semibold ${profile?.email_verified ? 'text-emerald-600' : 'text-amber-600'}`}>
              {profile?.email_verified ? 'Verified' : 'Pending'}
            </p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-slate-500">Role</p>
            <p className="mt-2 font-semibold text-slate-900 capitalize">{profile?.role || 'user'}</p>
          </div>
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4">
            <p className="text-slate-500">Member since</p>
            <p className="mt-2 font-semibold text-slate-900">{formatDate(profile?.created_at)}</p>
          </div>
        </div>

        <div className="rounded-xl border border-cyan-100 bg-cyan-50 p-4 text-sm text-cyan-900">
          This section reads directly from your authenticated profile endpoint so the account snapshot stays aligned with backend state.
        </div>
      </div>
    </div>
  );
}

export default ProfileCard;