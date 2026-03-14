import { Card, Skeleton } from '../../components/ui';

function Workouts() {
  return (
    <div>
      {/* Page Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">💪</span>
          Workouts
        </h1>
        <p className="text-gray-600 mt-2">Log your exercises and track your fitness progress</p>
      </div>

      {/* Placeholder Content */}
      <Card className="text-center">
        <div className="mb-4 text-6xl">🏋️</div>
        <h2 className="mb-2 text-xl font-semibold text-gray-800">Workout Tracking Module Pending Integration</h2>
        <p className="mx-auto max-w-xl text-gray-600">
          This screen is now ready for a full workout logging flow with loading skeletons, history, and toast feedback once workout endpoints are connected on the frontend.
        </p>

        <div className="mx-auto mt-8 grid max-w-3xl grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-left">
              <Skeleton className="mb-3 h-5 w-1/2" />
              <Skeleton className="mb-2 h-4 w-4/5" />
              <Skeleton className="h-4 w-2/3" />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}

export default Workouts;
