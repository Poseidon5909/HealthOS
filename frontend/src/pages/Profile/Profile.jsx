import { useEffect } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'react-hot-toast';
import useAuthStore from '../../store/authStore';
import {
  changeCurrentUserPassword,
  deactivateCurrentUserAccount,
  deleteCurrentUserAccount,
  getCurrentUserProfile,
  PROFILE_QUERY_KEY,
  updateCurrentUserProfile,
} from '../../services/profileService';
import { parseErrorMessage } from '../../utils/validation';
import ProfileCard from '../../components/profile/ProfileCard';
import ProfileEditForm from '../../components/profile/ProfileEditForm';
import ChangePasswordForm from '../../components/profile/ChangePasswordForm';
import AccountActions from '../../components/profile/AccountActions';
import { ErrorState, Loader } from '../../components/ui';

function Profile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);

  const {
    data: profile,
    isLoading,
    isError,
    error,
    refetch,
  } = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: getCurrentUserProfile,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  useEffect(() => {
    if (profile) {
      setUser(profile);
    }
  }, [profile, setUser]);

  const updateProfileMutation = useMutation({
    mutationFn: updateCurrentUserProfile,
    onSuccess: async (updatedProfile) => {
      setUser(updatedProfile);
      queryClient.setQueryData(PROFILE_QUERY_KEY, updatedProfile);
      await queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
      toast.success('Profile updated successfully');
    },
    onError: (mutationError) => {
      toast.error(parseErrorMessage(mutationError));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: changeCurrentUserPassword,
    onSuccess: (response) => {
      toast.success(response?.message || 'Password changed successfully');
    },
    onError: (mutationError) => {
      toast.error(parseErrorMessage(mutationError));
    },
  });

  const deactivateAccountMutation = useMutation({
    mutationFn: deactivateCurrentUserAccount,
    onSuccess: (response) => {
      toast.success(response?.message || 'Account deactivated successfully');
      logout();
    },
    onError: (mutationError) => {
      toast.error(parseErrorMessage(mutationError));
    },
  });

  const deleteAccountMutation = useMutation({
    mutationFn: deleteCurrentUserAccount,
    onSuccess: (response) => {
      toast.success(response?.message || 'Account deleted successfully');
      logout();
    },
    onError: (mutationError) => {
      toast.error(parseErrorMessage(mutationError));
    },
  });

  const handleProfileUpdate = async (profileData) => {
    await updateProfileMutation.mutateAsync(profileData);
  };

  const handlePasswordChange = async (passwordData) => {
    await changePasswordMutation.mutateAsync(passwordData);
  };

  const handleDeactivate = async (password) => {
    await deactivateAccountMutation.mutateAsync(password);
  };

  const handleDelete = async (password) => {
    await deleteAccountMutation.mutateAsync(password);
  };

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 flex items-center">
          <span className="mr-3">👤</span>
          Profile
        </h1>
        <p className="text-gray-600 mt-2">
          Manage your account details, security settings, and lifecycle actions from one place.
        </p>
      </div>

      <div className="mb-6 rounded-2xl border border-sky-100 bg-sky-50 p-5 text-sm text-sky-900">
        React Query manages the server state on this page. The profile is cached under one query key, and successful mutations invalidate that cache so the page automatically refetches fresh account data instead of relying on stale local copies.
      </div>

      {isLoading && (
        <div className="flex items-center justify-center min-h-[320px] rounded-2xl border border-slate-200 bg-white shadow-sm">
          <Loader label="Loading your profile..." />
        </div>
      )}

      {isError && (
        <ErrorState title="Unable to load your profile" error={error} onRetry={() => refetch()} />
      )}

      {!isLoading && !isError && profile && (
        <div className="grid grid-cols-1 xl:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] gap-6 items-start">
          <div className="space-y-6">
            <ProfileCard profile={profile} />
          </div>

          <div className="space-y-6">
            <ProfileEditForm
              profile={profile}
              onSubmit={handleProfileUpdate}
              isSubmitting={updateProfileMutation.isPending}
            />
            <ChangePasswordForm
              onSubmit={handlePasswordChange}
              isSubmitting={changePasswordMutation.isPending}
            />
            <AccountActions
              onDeactivate={handleDeactivate}
              onDelete={handleDelete}
              isDeactivating={deactivateAccountMutation.isPending}
              isDeleting={deleteAccountMutation.isPending}
            />
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;
