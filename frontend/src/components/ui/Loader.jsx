function Loader({
  label = 'Loading...',
  size = 'md',
  className = ''
}) {
  const sizeClasses = {
    sm: 'h-5 w-5 border-2',
    md: 'h-8 w-8 border-[3px]',
    lg: 'h-12 w-12 border-4'
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div className="text-center">
        <div className={`mx-auto mb-3 animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClasses[size] || sizeClasses.md}`} />
        <p className="text-sm text-slate-600">{label}</p>
      </div>
    </div>
  );
}

export default Loader;
