import MacroTargetsDisplay from './MacroTargetsDisplay';

function TargetSummaryCard({ calculatedTargets, onSave, isSaving }) {
  if (!calculatedTargets) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-dashed border-slate-300 p-6">
        <h2 className="text-xl font-semibold text-slate-900">Recommended Targets</h2>
        <p className="text-sm text-slate-600 mt-3">
          Submit the calculator form to fetch your personalized recommendation from the backend.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">Calculated Recommendation</h2>
        <p className="text-sm text-slate-600 mt-2">
          These values came from the backend calculation service. Saving them creates or updates your shared daily goal source so dashboard, diary, and hydration views all reflect the same target baseline.
        </p>
      </div>

      <MacroTargetsDisplay targets={calculatedTargets} title="Recommended nutrition targets" />

      <div className="mt-4 rounded-xl border border-cyan-100 bg-cyan-50 p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-cyan-900">Water target</p>
            <p className="text-2xl font-bold text-cyan-950 mt-1">{calculatedTargets.water_ml} ml</p>
          </div>
          <button
            type="button"
            onClick={onSave}
            disabled={isSaving}
            className="inline-flex items-center justify-center rounded-xl bg-cyan-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-cyan-700 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSaving ? 'Saving daily targets...' : 'Save as today\'s targets'}
          </button>
        </div>
      </div>
    </div>
  );
}

export default TargetSummaryCard;