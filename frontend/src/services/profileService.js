import api from './api';

export const PROFILE_QUERY_KEY = ['profile', 'me'];

export const getCurrentUserProfile = async () => {
  const response = await api.get('/users/me');
  return response.data;
};

export const updateCurrentUserProfile = async (profileData) => {
  const response = await api.put('/users/me', profileData);
  return response.data;
};

export const changeCurrentUserPassword = async (passwordData) => {
  const response = await api.post('/users/me/change-password', passwordData);
  return response.data;
};

export const deactivateCurrentUserAccount = async (password) => {
  const response = await api.post('/users/me/deactivate', null, {
    params: { password },
  });
  return response.data;
};

export const deleteCurrentUserAccount = async (password) => {
  const response = await api.delete('/users/me', {
    params: { password },
  });
  return response.data;
};