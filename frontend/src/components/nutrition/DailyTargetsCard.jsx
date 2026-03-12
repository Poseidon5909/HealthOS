import MacroTargetsDisplay from './MacroTargetsDisplay';

function DailyTargetsCard({ targets, title = 'Today\'s Targets', description, compact = false }) {
  if (!targets) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        <p className="text-sm text-slate-600 mt-3">
          No daily targets have been saved yet. Use the calculator to generate your current goal baseline.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-slate-900">{title}</h2>
        {description && <p className="text-sm text-slate-600 mt-2">{description}</p>}
      </div>

      <MacroTargetsDisplay targets={targets} title="Saved daily nutrition targets" compact={compact} />

      <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div>
            <p className="text-sm font-medium text-blue-900">Water target</p>
            <p className="text-2xl font-bold text-blue-950 mt-1">{targets.water_target} ml</p>
          </div>
          <div className="text-sm text-blue-900 max-w-sm">
            Centralized targets improve goal tracking because every page compares your intake against the same saved baseline rather than each feature guessing its own target values.
          </div>
        </div>
      </div>
    </div>
  );
}

export default DailyTargetsCard;