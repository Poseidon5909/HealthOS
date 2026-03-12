import { useState } from 'react';

function AccountActions({
  onDeactivate,
  onDelete,
  isDeactivating,
  isDeleting,
}) {
  const [deactivatePassword, setDeactivatePassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteConfirmation, setDeleteConfirmation] = useState('');
  const [error, setError] = useState('');

  const handleDeactivate = async () => {
    if (!deactivatePassword) {
      setError('Enter your password before deactivating the account');
      return;
    }

    const confirmed = window.confirm(
      'Deactivate your account? You will be logged out immediately and will need support to reactivate it.'
    );

    if (!confirmed) {
      return;
    }

    setError('');
    await onDeactivate(deactivatePassword);
    setDeactivatePassword('');
  };

  const handleDelete = async () => {
    if (!deletePassword) {
      setError('Enter your password before permanently deleting the account');
      return;
    }

    if (deleteConfirmation !== 'DELETE') {
      setError('Type DELETE to confirm permanent account deletion');
      return;
    }

    const confirmed = window.confirm(
      'Delete your account permanently? This cannot be undone and all related account access will be lost.'
    );

    if (!confirmed) {
      return;
    }

    setError('');
    await onDelete(deletePassword);
    setDeletePassword('');
    setDeleteConfirmation('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Account Actions</h2>
        <p className="text-sm text-slate-600 mt-2">
          Sensitive actions require both your password and a confirmation dialog so accidental clicks do not trigger irreversible account changes.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="space-y-6">
        <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5">
          <h3 className="text-lg font-semibold text-amber-900">Deactivate account</h3>
          <p className="text-sm text-amber-800 mt-2">
            This is a soft shutdown. Your account becomes inactive and you will be signed out immediately.
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="password"
              value={deactivatePassword}
              onChange={(event) => {
                setDeactivatePassword(event.target.value);
                if (error) {
                  setError('');
                }
              }}
              disabled={isDeactivating || isDeleting}
              autoComplete="current-password"
              className="w-full rounded-xl border border-amber-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-amber-500 focus:ring-4 focus:ring-amber-100 disabled:bg-slate-100"
              placeholder="Enter current password"
            />
            <button
              type="button"
              onClick={handleDeactivate}
              disabled={isDeactivating || isDeleting}
              className="inline-flex items-center justify-center rounded-xl bg-amber-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-amber-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isDeactivating ? 'Deactivating account...' : 'Deactivate account'}
            </button>
          </div>
        </div>

        <div className="rounded-2xl border border-rose-200 bg-rose-50 p-5">
          <h3 className="text-lg font-semibold text-rose-900">Delete account</h3>
          <p className="text-sm text-rose-800 mt-2">
            This permanently removes the account. Type DELETE to confirm that you understand this action cannot be undone.
          </p>
          <div className="mt-4 space-y-3">
            <input
              type="password"
              value={deletePassword}
              onChange={(event) => {
                setDeletePassword(event.target.value);
                if (error) {
                  setError('');
                }
              }}
              disabled={isDeleting || isDeactivating}
              autoComplete="current-password"
              className="w-full rounded-xl border border-rose-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100 disabled:bg-slate-100"
              placeholder="Enter current password"
            />
            <input
              type="text"
              value={deleteConfirmation}
              onChange={(event) => {
                setDeleteConfirmation(event.target.value);
                if (error) {
                  setError('');
                }
              }}
              disabled={isDeleting || isDeactivating}
              className="w-full rounded-xl border border-rose-300 bg-white px-4 py-3 text-slate-900 outline-none transition focus:border-rose-500 focus:ring-4 focus:ring-rose-100 disabled:bg-slate-100"
              placeholder="Type DELETE to confirm"
            />
            <button
              type="button"
              onClick={handleDelete}
              disabled={isDeleting || isDeactivating}
              className="inline-flex items-center justify-center rounded-xl bg-rose-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-rose-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {isDeleting ? 'Deleting account...' : 'Delete permanently'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AccountActions;