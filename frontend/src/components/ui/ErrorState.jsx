import Button from './Button';
import { parseErrorMessage } from '../../utils/validation';

function ErrorState({
  title = 'Something went wrong',
  error,
  onRetry,
  className = ''
}) {
  const status = error?.response?.status;
  const message = parseErrorMessage(error);

  const statusLabel =
    status === 401
      ? 'Unauthorized access'
      : status
        ? `Request failed (${status})`
        : 'Network/API error';

  return (
    <div className={`rounded-2xl border border-rose-200 bg-rose-50 p-6 text-center ${className}`}>
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-rose-100 text-2xl">⚠️</div>
      <h3 className="text-lg font-semibold text-rose-900">{title}</h3>
      <p className="mt-1 text-sm font-medium text-rose-700">{statusLabel}</p>
      <p className="mt-2 text-sm text-rose-700">{message}</p>
      {onRetry && (
        <div className="mt-5">
          <Button variant="danger" onClick={onRetry}>
            Retry
          </Button>
        </div>
      )}
    </div>
  );
}

export default ErrorState;
