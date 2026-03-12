import { useEffect, useState } from 'react';
import { isValidEmail, validateName } from '../../utils/validation';

function ProfileEditForm({ profile, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [error, setError] = useState('');

  useEffect(() => {
    setFormData({
      name: profile?.name || '',
      email: profile?.email || '',
    });
  }, [profile]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const trimmedName = formData.name.trim();
    const trimmedEmail = formData.email.trim();
    const nameValidation = validateName(trimmedName);

    if (!nameValidation.isValid) {
      setError(nameValidation.error);
      return;
    }

    if (!isValidEmail(trimmedEmail)) {
      setError('Please enter a valid email address');
      return;
    }

    if (trimmedName === profile?.name && trimmedEmail === profile?.email) {
      setError('No profile changes to save yet');
      return;
    }

    setError('');
    await onSubmit({ name: trimmedName, email: trimmedEmail });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Edit Profile</h2>
        <p className="text-sm text-slate-600 mt-2">
          Update your name or email. If you change your email address, the backend will mark it as unverified until that new address is confirmed.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="profile-name">
            Name
          </label>
          <input
            id="profile-name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="name"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            placeholder="Enter your full name"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2" htmlFor="profile-email">
            Email
          </label>
          <input
            id="profile-email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            disabled={isSubmitting}
            autoComplete="email"
            className="w-full rounded-xl border border-slate-300 px-4 py-3 text-slate-900 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            placeholder="Enter your email address"
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Saving changes...' : 'Save profile'}
        </button>
      </form>
    </div>
  );
}

export default ProfileEditForm;