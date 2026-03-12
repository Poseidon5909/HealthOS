import api from './api';

export const NUTRITION_QUERY_KEYS = {
  profile: ['nutrition', 'profile'],
  todayTargets: ['nutrition', 'dailyTargets', 'today'],
  calculation: ['nutrition', 'calculation'],
};

const isNotFound = (error) => error?.response?.status === 404;

export const getNutritionProfile = async () => {
  try {
    const response = await api.get('/profile/');
    return response.data;
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }
};

export const saveNutritionProfile = async (profileData, hasExistingProfile) => {
  const endpoint = '/profile/';
  const response = hasExistingProfile
    ? await api.put(endpoint, profileData)
    : await api.post(endpoint, profileData);

  return response.data;
};

export const calculateDailyTargets = async () => {
  const response = await api.get('/nutrition/calculate-daily-targets');
  return response.data;
};

export const getTodayDailyTargets = async () => {
  try {
    const response = await api.get('/daily-targets/today');
    return response.data;
  } catch (error) {
    if (isNotFound(error)) {
      return null;
    }

    throw error;
  }
};

export const generateTodayDailyTargets = async () => {
  const response = await api.post('/daily-targets/today');
  return response.data;
};

export const updateDailyTargets = async (targetData, targetDate) => {
  const response = await api.put('/daily-targets/', targetData, {
    params: {
      target_date: targetDate,
    },
  });

  return response.data;
};

export const mapCalculatedTargetsToDailyTargetPayload = (targets) => ({
  calorie_target: targets.total_calories,
  protein_target: targets.protein_grams,
  fat_target: targets.fat_grams,
  carb_target: targets.carb_grams,
  water_target: targets.water_ml,
});

export const saveCalculatedTargetsForToday = async (calculatedTargets) => {
  const today = new Date().toISOString().split('T')[0];

  try {
    const existingTargets = await getTodayDailyTargets();

    if (!existingTargets) {
      return await generateTodayDailyTargets();
    }

    return await updateDailyTargets(
      mapCalculatedTargetsToDailyTargetPayload(calculatedTargets),
      today
    );
  } catch (error) {
    if (isNotFound(error)) {
      return await generateTodayDailyTargets();
    }

    throw error;
  }
};