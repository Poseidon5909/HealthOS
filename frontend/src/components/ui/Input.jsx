function Input({ className = '', error = false, ...props }) {
  return (
    <input
      className={`h-11 w-full rounded-xl border bg-white px-3 text-sm text-slate-900 outline-none transition-all focus:ring-4 ${
        error
          ? 'border-rose-300 focus:border-rose-400 focus:ring-rose-100'
          : 'border-slate-300 focus:border-indigo-500 focus:ring-indigo-100'
      } ${className}`}
      {...props}
    />
  );
}

export default Input;
