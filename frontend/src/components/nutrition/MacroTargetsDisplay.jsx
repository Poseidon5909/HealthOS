function MacroTargetsDisplay({ targets, title = 'Macro Targets', compact = false }) {
  const macroItems = [
    {
      label: 'Calories',
      value: targets?.calories ?? targets?.calorie_target ?? targets?.total_calories ?? 0,
      unit: 'kcal',
      color: 'bg-rose-500',
    },
    {
      label: 'Protein',
      value: targets?.protein ?? targets?.protein_target ?? targets?.protein_grams ?? 0,
      unit: 'g',
      color: 'bg-sky-500',
    },
    {
      label: 'Carbs',
      value: targets?.carbs ?? targets?.carb_target ?? targets?.carb_grams ?? 0,
      unit: 'g',
      color: 'bg-amber-500',
    },
    {
      label: 'Fat',
      value: targets?.fat ?? targets?.fat_target ?? targets?.fat_grams ?? 0,
      unit: 'g',
      color: 'bg-emerald-500',
    },
  ];

  return (
    <div>
      <h3 className="text-base font-semibold text-slate-900 mb-4">{title}</h3>
      <div className={`grid gap-3 ${compact ? 'grid-cols-2' : 'grid-cols-1 sm:grid-cols-2'}`}>
        {macroItems.map((item) => (
          <div key={item.label} className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="text-sm font-medium text-slate-600">{item.label}</span>
              <span className={`h-2.5 w-2.5 rounded-full ${item.color}`}></span>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">
              {item.value}
              <span className="ml-1 text-sm font-medium text-slate-500">{item.unit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MacroTargetsDisplay;