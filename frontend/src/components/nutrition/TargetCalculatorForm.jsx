import { useEffect, useState } from 'react';

const defaultFormData = {
  weight: '',
  height: '',
  age: '',
  gender: 'male',
  activity_level: 'moderate',
  goal: 'maintain',
};

function TargetCalculatorForm({ initialValues, onSubmit, isSubmitting }) {
  const [formData, setFormData] = useState(defaultFormData);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!initialValues) {
      return;
    }

    setFormData({
      weight: initialValues.weight ?? '',
      height: initialValues.height ?? '',
      age: initialValues.age ?? '',
      gender: initialValues.gender ?? 'male',
      activity_level: initialValues.activity_level ?? 'moderate',
      goal: initialValues.goal ?? 'maintain',
    });
  }, [initialValues]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((current) => ({ ...current, [name]: value }));

    if (error) {
      setError('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const numericFields = {
      weight: Number(formData.weight),
      height: Number(formData.height),
      age: Number(formData.age),
    };

    if (Object.values(numericFields).some((value) => Number.isNaN(value) || value <= 0)) {
      setError('Weight, height, and age must all be valid positive numbers');
      return;
    }

    setError('');
    await onSubmit({
      weight: numericFields.weight,
      height: numericFields.height,
      age: numericFields.age,
      gender: formData.gender,
      activity_level: formData.activity_level,
      goal: formData.goal,
    });
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Target Calculator</h2>
        <p className="text-sm text-slate-600 mt-2">
          Enter your current body metrics and activity profile. The frontend saves those values to your fitness profile, then asks the backend to calculate personalized daily calorie, macro, and hydration targets.
        </p>
      </div>

      {error && (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-slate-700 mb-2">Weight (kg)</label>
            <input
              id="weight"
              name="weight"
              type="number"
              min="20"
              max="500"
              step="0.1"
              value={formData.weight}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
              placeholder="72"
            />
          </div>

          <div>
            <label htmlFor="height" className="block text-sm font-medium text-slate-700 mb-2">Height (cm)</label>
            <input
              id="height"
              name="height"
              type="number"
              min="50"
              max="300"
              step="0.1"
              value={formData.height}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
              placeholder="175"
            />
          </div>

          <div>
            <label htmlFor="age" className="block text-sm font-medium text-slate-700 mb-2">Age</label>
            <input
              id="age"
              name="age"
              type="number"
              min="10"
              max="120"
              step="1"
              value={formData.age}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
              placeholder="28"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label htmlFor="gender" className="block text-sm font-medium text-slate-700 mb-2">Gender</label>
            <select
              id="gender"
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            >
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div>
            <label htmlFor="activity_level" className="block text-sm font-medium text-slate-700 mb-2">Activity Level</label>
            <select
              id="activity_level"
              name="activity_level"
              value={formData.activity_level}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            >
              <option value="sedentary">Sedentary</option>
              <option value="light">Light</option>
              <option value="moderate">Moderate</option>
              <option value="active">Active</option>
              <option value="very_active">Very Active</option>
            </select>
          </div>

          <div>
            <label htmlFor="goal" className="block text-sm font-medium text-slate-700 mb-2">Goal</label>
            <select
              id="goal"
              name="goal"
              value={formData.goal}
              onChange={handleChange}
              disabled={isSubmitting}
              className="w-full rounded-xl border border-slate-300 px-4 py-3 outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100 disabled:bg-slate-100"
            >
              <option value="lose">Lose Weight</option>
              <option value="maintain">Maintain</option>
              <option value="gain">Gain Muscle</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="inline-flex items-center justify-center rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? 'Calculating targets...' : 'Calculate recommended targets'}
        </button>
      </form>
    </div>
  );
}

export default TargetCalculatorForm;