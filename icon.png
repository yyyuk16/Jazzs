import apiClient from '../client';
import { Spots, LocationRequest } from '../types';

export const recommendPlacesApi = {
  // バックエンドが説明文付きで返してくれるので、そのままリクエストして返すだけ
  getRecommendPlaces: async (data: LocationRequest): Promise<Spots> => {
    const response = await apiClient.post<Spots>('/search/map', data);
    console.log(response);
    return response.data;
  } 
};