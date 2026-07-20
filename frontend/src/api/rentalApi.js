import axiosInstance from './axios';

export const rentalApi = {
  getAllRentals: async () => {
    const response = await axiosInstance.get('/rentals');
    return response.data;
  },
  getRental: async (id) => {
    const response = await axiosInstance.get(`/rentals/${id}`);
    return response.data;
  },
  createRental: async (data) => {
    const response = await axiosInstance.post('/rentals', data);
    return response.data;
  },
  updateStatus: async (id, statusData) => {
    const response = await axiosInstance.patch(`/rentals/${id}/status`, statusData);
    return response.data;
  },
  returnRental: async (id) => {
    const response = await axiosInstance.patch(`/rentals/${id}/return`);
    return response.data;
  },
  deleteRental: async (id) => {
    const response = await axiosInstance.delete(`/rentals/${id}`);
    return response.data;
  }
};
