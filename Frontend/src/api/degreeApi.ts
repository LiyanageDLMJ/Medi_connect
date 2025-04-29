import api from './axios';

interface Degree {
  _id: string;
  degreeName: string;
  status: string;
  mode: string;
  applicationDeadline: string;
  eligibility: string;
  seatsAvailable: number;
  applicantsApplied: number;
  duration: string;
  tuitionFee: string;
  institute: {
    _id: string;
    instituteName: string;
  };
}

interface FetchDegreesResponse {
  degrees: Degree[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Fetch all degrees with filtering and pagination
export const fetchDegrees = async (
  searchQuery: string,
  status: string,
  mode: string,
  duration: string,
  tuitionFee: string,
  startDate: string | undefined,
  endDate: string | undefined,
  page: number,
  limit: number
): Promise<FetchDegreesResponse> => {
  const response = await api.get('/api/degrees/viewDegrees', {
    params: {
      searchQuery,
      status,
      mode,
      duration,
      tuitionFee,
      startDate,
      endDate,
      page,
      limit,
    },
  });
  return response.data;
};

// Create a new degree
export const createDegree = async (degreeData: Omit<Degree, '_id' | 'institute'> & { institute: string }): Promise<Degree> => {
  const response = await api.post('/api/degrees/postDegree', degreeData);
  return response.data;
};

// Update a degree
export const updateDegree = async (id: string, degreeData: Partial<Degree>): Promise<Degree> => {
  const response = await api.put(`/api/degrees/updateDegree/${id}`, degreeData);
  return response.data;
};

// Delete a degree
export const deleteDegree = async (id: string): Promise<{ message: string }> => {
  const response = await api.delete(`/api/degrees/deleteDegree/${id}`);
  return response.data;
};