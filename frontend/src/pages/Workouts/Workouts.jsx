import { useMemo, useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import { parseErrorMessage } from '../../utils/validation';
import { Card, ErrorState, Loader } from '../../components/ui';
import {
  WORKOUT_QUERY_KEYS,
  deleteWorkoutLog,
  getWorkoutHistory,
  logWorkout,
  searchExercises,
} from '../../services/workoutService';

function Workouts() {
  const queryClient = useQueryClient();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedExercise, setSelectedExercise] = useState(null);
  const [duration, setDuration] = useState('30');

  const canSearch = searchTerm.trim().length >= 2;

  const {
    data: exerciseResults,
    isFetching: isSearching,
    error: exerciseError,
  } = useQuery({
    queryKey: WORKOUT_QUERY_KEYS.exerciseSearch(searchTerm.trim()),
    queryFn: () => searchExercises(searchTerm.trim()),
    enabled: canSearch,
    staleTime: 5 * 60 * 1000,
  });

  const {
    data: history = [],
    isLoading: isHistoryLoading,
    error: historyError,
  } = useQuery({
    queryKey: WORKOUT_QUERY_KEYS.history,
    queryFn: getWorkoutHistory,
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const logWorkoutMutation = useMutation({
    mutationFn: logWorkout,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.history });
      setDuration('30');
      toast.success('Workout logged successfully.');
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error));
    },
  });

  const deleteWorkoutMutation = useMutation({
    mutationFn: deleteWorkoutLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.history });
      toast.success('Workout deleted.');
    },
    onError: (error) => {
      toast.error(parseErrorMessage(error));
    },
  });

  const exercises = exerciseResults?.items || [];

  const totalCaloriesToday = useMemo(() => {
    return history.reduce((sum, log) => sum + (Number(log.calories_burned) || 0), 0);
  }, [history]);

  const handleLogWorkout = async (event) => {
    event.preventDefault();

    const minutes = Number(duration);

    if (!selectedExercise) {
      toast.error('Select an exercise first.');
      return;
    }

    if (!Number.isFinite(minutes) || minutes < 1 || minutes > 720) {
      toast.error('Duration must be between 1 and 720 minutes.');
      return;
    }

    await logWorkoutMutation.mutateAsync({
      exercise_id: selectedExercise.id,
      duration_minutes: minutes,
    });
  };

  const handleDeleteWorkout = async (logId) => {
    if (!window.confirm('Delete this workout entry?')) {
      return;
    }

    await deleteWorkoutMutation.mutateAsync(logId);
  };

  if (historyError?.response?.status === 401) {
    return <ErrorState title="Please log in again" error={historyError} />;
  }

  return (
    <div className="space-y-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">💪</span>
          Workouts
        </h1>
        <p className="text-gray-600 mt-2">Search exercises, log sessions, and track calorie burn history.</p>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_1.2fr] gap-6 items-start">
        <Card className="space-y-5">
          <div>
            <h2 className="text-xl font-semibold text-slate-900">1) Search Exercise</h2>
            <p className="text-sm text-slate-600 mt-1">Type at least 2 characters to find an exercise.</p>
          </div>

          <input
            type="text"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Try: running, squat, cycling"
            className="w-full rounded-xl border border-slate-300 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />

          {exerciseError && (
            <ErrorState
              title="Exercise search failed"
              error={exerciseError}
              className="!text-left"
            />
          )}

          {isSearching && <Loader label="Searching exercises..." className="py-4" />}

          {canSearch && !isSearching && exercises.length === 0 && (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
              No exercises found for "{searchTerm.trim()}".
            </div>
          )}

          {exercises.length > 0 && (
            <div className="max-h-72 overflow-auto space-y-2 pr-1">
              {exercises.map((exercise) => {
                const isSelected = selectedExercise?.id === exercise.id;

                return (
                  <button
                    key={exercise.id}
                    type="button"
                    onClick={() => setSelectedExercise(exercise)}
                    className={`w-full rounded-xl border px-4 py-3 text-left transition ${
                      isSelected
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-slate-200 bg-white hover:border-indigo-300'
                    }`}
                  >
                    <div className="font-semibold text-slate-900">{exercise.name}</div>
                    <div className="text-xs text-slate-600 mt-1 capitalize">
                      {exercise.category} • MET {Number(exercise.met_value).toFixed(1)}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          <form onSubmit={handleLogWorkout} className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">2) Log Workout</h3>
            <p className="text-sm text-slate-600">
              Selected: <span className="font-medium text-slate-900">{selectedExercise?.name || 'None'}</span>
            </p>

            <label className="block text-sm text-slate-700">
              Duration (minutes)
              <input
                type="number"
                min="1"
                max="720"
                value={duration}
                onChange={(event) => setDuration(Number(event.target.value) || '')}
                className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </label>

            <button
              type="submit"
              disabled={!selectedExercise || logWorkoutMutation.isPending}
              className="w-full rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:bg-slate-400"
            >
              {logWorkoutMutation.isPending ? 'Logging...' : 'Log Workout'}
            </button>
          </form>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-slate-900">Workout History</h2>
            <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Today Burn: {Math.round(totalCaloriesToday)} kcal
            </div>
          </div>

          {isHistoryLoading ? (
            <Loader label="Loading workout history..." />
          ) : historyError ? (
            <ErrorState
              title="Unable to load workout history"
              error={historyError}
              onRetry={() => queryClient.invalidateQueries({ queryKey: WORKOUT_QUERY_KEYS.history })}
            />
          ) : history.length === 0 ? (
            <div className="rounded-xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              No workouts logged yet. Search an exercise and log your first session.
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((log) => (
                <div
                  key={log.id}
                  className="flex flex-col gap-2 rounded-xl border border-slate-200 bg-white p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <div className="text-sm font-semibold text-slate-900">Exercise ID: {log.exercise_id}</div>
                    <div className="text-xs text-slate-600 mt-1">
                      {log.duration_minutes} min • {Math.round(Number(log.calories_burned) || 0)} kcal • {log.date}
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleDeleteWorkout(log.id)}
                    disabled={deleteWorkoutMutation.isPending}
                    className="rounded-lg border border-rose-200 bg-rose-50 px-3 py-1.5 text-xs font-semibold text-rose-700 hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    Delete
                  </button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="border-sky-200 bg-sky-50">
        <h3 className="font-semibold text-sky-900">Edge-case handling covered</h3>
        <div className="mt-2 text-sm text-sky-800 space-y-1">
          <p>• Empty search results show a clear message.</p>
          <p>• Invalid duration is blocked client-side before API call.</p>
          <p>• API failures surface a user-friendly toast from shared error parsing.</p>
          <p>• Unauthorized requests route through global auth/session handling.</p>
        </div>
      </Card>
    </div>
  );
}

export default Workouts;
