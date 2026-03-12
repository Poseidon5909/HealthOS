import { useState } from 'react';
import { passwordsMatch, validatePassword } from '../../utils/validation';

function ChangePasswordForm({ onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!formData.oldPassword || !formData.newPassword) {
      setError('Current and new password are required');
      return;
    }

    const passwordValidation = validatePassword(formData.newPassword);
    if (!passwordValidation.isValid) {
      setError(passwordValidation.errors[0]);
      return;
    }

    if (!passwordsMatch(formData.newPassword, formData.confirmPassword)) {
      setError('New password and confirmation do not match');
      return;
    }

    if (formData.oldPassword === formData.newPassword) {
      setError('New password must be different from your current password');
      return;
    }

    setError('');
    await onSubmit({
      old_password: formData.oldPassword,
      new_password: formData.newPassword,
    });

    setFormData({
      oldPassword: '',
      newPassword: '',
      confirmPassword: '',
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Change Password</h2>
        <p className="text-sm text-slate-600 mt-2">
          The backend asks for your current password before accepting a new one so a stolen browser session cannot silently rotate credentials without proof of the existing secret.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="current-password">
            Current password
          </label>
          <input
            id="current-password"
            name="oldPassword"
            type="password"
            value={formData.oldPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="current-password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            placeholder="Enter your current password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="new-password">
            New password
          </label>
          <input
            id="new-password"
            name="newPassword"
            type="password"
            value={formData.newPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            placeholder="Create a stronger password"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="confirm-password">
            Confirm new password
          </label>
          <input
            id="confirm-password"
            name="confirmPassword"
            type="password"
            value={formData.confirmPassword}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="new-password"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            placeholder="Re-enter your new password"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Updating password...' : 'Update password'}
        </button>
      </form>
    </div>
  );
}

export default ChangePasswordForm;