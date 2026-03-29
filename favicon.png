import apiClient from '../client';
import { HealthResponse } from '../types';

export const healthCheckApi = {
  getHealth: async (): Promise<HealthResponse> => {
    console.log("a");
    const response = await apiClient.get('/');
    console.log(response.data);
    return response.data;
  }
}