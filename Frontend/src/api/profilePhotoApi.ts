import axios from './axios';

const API_BASE = window.location.origin.includes('localhost') ? 'http://localhost:3000' : window.location.origin;

export interface ProfilePhotoResponse {
  success: boolean;
  message: string;
  data: {
    photoUrl: string;
    publicId?: string;
    user: {
      id: string;
      name: string;
      email: string;
      userType: string;
    };
  };
}

export const uploadProfilePhoto = async (userId: string, file: File): Promise<ProfilePhotoResponse> => {
  const formData = new FormData();
  formData.append('profilePhoto', file);
  formData.append('userId', userId);

  const response = await axios.post(`${API_BASE}/profile-photo/upload`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });

  return response.data;
};

export const deleteProfilePhoto = async (userId: string): Promise<ProfilePhotoResponse> => {
  const response = await axios.delete(`${API_BASE}/profile-photo/${userId}`);
  return response.data;
};

export const getProfilePhoto = async (userId: string): Promise<{ success: boolean; data: { photoUrl: string; name: string } }> => {
  const response = await axios.get(`${API_BASE}/profile-photo/${userId}`);
  return response.data;
}; 