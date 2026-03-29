from fastapi import APIRouter, HTTPException
from app.models.schema import ChatRequest, ChatResponse, SpotInfo
from app.services.llm import llm_service
from app.services.google import search_nearby_spots
import traceback

router = APIRouter()

@router.post("/chat/recommend", response_model=ChatResponse)
async def chat_recommend(request: ChatRequest):

  # 1. LLMでチャットの意図解析
  intent = await llm_service.analyze_intent(request.chat_text)
  print(f"Intent: {intent.keyword}, Type: {intent.place_type}")

  print(f"latitude: {request.latitude}, longitude: {request.longitude}")
  # 2. Google Place APIで検索
  candidates_data = search_nearby_spots(
    lat=request.latitude,
    lng=request.longitude,
    keyword=intent.keyword,
    place_type=intent.place_type
  )

  if not candidates_data:
    raise HTTPException(status_code=404, detail="周辺に該当するスポットが見つかりませんでした。")

  # 3. LLMでおすすめスポット選定
  recommendation = await llm_service.select_recommendation(
    chat_text=request.chat_text,
    spots=candidates_data
  )

  # 4. データの整形
  candidates_objs = [SpotInfo(**s) for s in candidates_data]

  selected_spot_obj = next(
    (s for s in candidates_objs if s.place_id == recommendation.selected_place_id),
    candidates_objs[0]
  )

  return ChatResponse(
    candidates=candidates_objs,
    recommended_spot=selected_spot_obj,
    reason=recommendation.reason
  )