from pydantic import BaseModel, Field
from typing import List, Optional

# --- 1. フロントエンドとの通信用 ---

class LocationRequest(BaseModel):
    latitude: float
    longitude: float
    limit: Optional[int] = 5
    description_count: Optional[int] = 5

class Spot(BaseModel):
    name: str
    latitude: float
    longitude: float
    distance: float
    description: str = ""  

class SpotsResponse(BaseModel):
    spots: List[Spot]

# aiチャット機能用データ
class SpotInfo(BaseModel):
    place_id: str
    name: str
    latitude: float
    longitude: float
    rating: Optional[float] = None
    vicinity: Optional[str] = None

# aiチャット機能の入力用
class ChatRequest(BaseModel):
    chat_text: str
    latitude: float
    longitude: float

# aiチャット機能の出力用
class ChatResponse(BaseModel):
    candidates: List[SpotInfo]
    recommended_spot: SpotInfo
    reason: str

# --- 2. Gemini (LLM) の構造化出力用スキーマ ---

class SearchIntent(BaseModel):
    keyword: str = Field(description="Google Maps検索に使用するキーワード")
    place_type: str = Field(description="Google Places APIのplace type (例: cafe, restaurant, park)")

class RecommendationResult(BaseModel):
    selected_place_id: str = Field(description="最もおすすめするスポットのplace_id")
    reason: str = Field(description="なぜそこを選んだかの理由（150文字以内の親しみやすい説明文）")