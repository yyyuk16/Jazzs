import apiClient from '../client';
import { ChatRequest, ChatResponse } from '../types';

export const chatApi = {
  /**
   * チャット文と位置情報を送信して、おすすめスポットを取得する
   */
  recommend: async (request: ChatRequest): Promise<ChatResponse> => {
    // POST /chat/recommend
    const response = await apiClient.post<ChatResponse>('/chat/recommend', request);
    return response.data;
  }
};