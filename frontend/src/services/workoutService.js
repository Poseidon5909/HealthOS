import api from './api';

export const WORKOUT_QUERY_KEYS = {
  exerciseSearch: (query) => ['workouts', 'exercises', query],
  history: ['workouts', 'history'],
};

export const searchExercises = async (query, limit = 25) => {
  const response = await api.get('/workouts/exercises/search', {
    params: {
      query,
      skip: 0,
      limit,
    },
  });

  return response.data;
};

export const logWorkout = async ({ exercise_id, duration_minutes }) => {
  const response = await api.post('/workouts/', {
    exercise_id,
    duration_minutes,
  });

  return response.data;
};

export const getWorkoutHistory = async (limit = 50) => {
  const response = await api.get('/workouts/history', {
    params: {
      skip: 0,
      limit,
    },
  });

  return response.data?.items || [];
};

export const deleteWorkoutLog = async (logId) => {
  const response = await api.delete(`/workouts/${logId}`);
  return response.data;
};
