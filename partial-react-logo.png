export interface LocationRequest {
  latitude: number;
  longitude: number;
  limit: number;
  description_count: number;
}

export interface Spot {
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  description: string;
}

export interface Spots {
  spots: Spot[];
}

// export interface UserPosition {
//   latitude: number;
//   longitude: number;
// }

export interface HealthResponse {
  status: string;
}

export interface UserLocation {
  latitude: number;
  longitude: number;
  timestamp: number;
}

// チャットAPI用
export interface ChatRequest {
  chat_text: string;
  latitude: number;
  longitude: number;
}

export interface ChatResponse {
  candidates: Spot[];      // 候補10件
  recommended_spot: Spot;  // おすすめ1件
  reason: string;          // おすすめ理由
}