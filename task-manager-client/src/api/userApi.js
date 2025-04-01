import axiosInstance from './axiosInstance';

export const fetchProfile = () => axiosInstance.get('/auth/me');