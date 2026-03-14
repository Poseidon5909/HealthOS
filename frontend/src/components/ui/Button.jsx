const baseClasses =
  'inline-flex items-center justify-center rounded-xl font-semibold transition-all duration-200 disabled:cursor-not-allowed disabled:opacity-60';

const sizeClasses = {
  sm: 'h-9 px-3 text-sm',
  md: 'h-11 px-4 text-sm',
  lg: 'h-12 px-6 text-base'
};

const variantClasses = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-sm hover:shadow',
  secondary: 'bg-slate-100 text-slate-700 hover:bg-slate-200',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 shadow-sm hover:shadow',
  ghost: 'bg-transparent text-slate-700 hover:bg-slate-100'
};

function Button({
  type = 'button',
  variant = 'primary',
  size = 'md',
  className = '',
  isLoading = false,
  children,
  ...props
}) {
  return (
    <button
      type={type}
      className={`${baseClasses} ${sizeClasses[size] || sizeClasses.md} ${variantClasses[variant] || variantClasses.primary} ${className}`}
      disabled={isLoading || props.disabled}
      {...props}
    >
      {isLoading ? (
        <span className="inline-flex items-center gap-2">
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
          <span>Loading...</span>
        </span>
      ) : (
        children
      )}
    </button>
  );
}

export default Button;
