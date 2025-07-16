import api from './axios';

export interface RegisterData {
  userType: string;
  email: string;
  password: string;
  confirmPassword: string;
  // Doctor fields
  profession?: string;
  specialty?: string;
  location?: string;
  // Medical Student fields
  higherEducation?: string;
  currentInstitute?: string;
  yearOfStudy?: string;
  fieldOfStudy?: string;
  // Recruiter fields
  hospitalName?: string;
  position?: string;
  healthcareType?: string;
  // Educational Institute fields
  instituteName?: string;
  instituteType?: string;
  accreditation?: string;
  establishedYear?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface AuthResponse {
  message: string;
  user?: {
    id: string;
    email: string;
    userType: string;
  };
  token?: string;
}

export const registerUser = async (userData: RegisterData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/register', userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Registration failed. Please try again.');
  }
};

export const loginUser = async (userData: LoginData): Promise<AuthResponse> => {
  try {
    const response = await api.post('/auth/login', userData);
    return response.data;
  } catch (error: any) {
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw new Error('Login failed. Please try again.');
  }
};
