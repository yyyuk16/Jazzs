from fastapi import APIRouter
from app.models.schema import LocationRequest, SpotsResponse
from app.services.google import search_nearby_spots 
from app.services.llm import llm_service

router = APIRouter()

@router.post("/search/map", response_model=SpotsResponse)
async def get_spots_with_description(location: LocationRequest):
    # 1. Google Maps API で検索
    spots = search_nearby_spots(
        lat=location.latitude,
        lng=location.longitude,
        keyword="観光スポット", 
        place_type="" 
    )

    limit = location.limit if location.limit else 10
    spots = spots[:limit]

    if not spots:
        return {"spots": []}

    # 2. LLM で説明文を生成
    desc_n = min(location.description_count or 0, len(spots))
    descriptions = {}

    if desc_n > 0:
        try:
            # ★修正: 名前だけでなく、住所や座標も含めたオブジェクトのリストを作成
            target_spots = spots[:desc_n]
            places_info = [
                {
                    "name": spot["name"],
                    "address": spot.get("vicinity", "住所不明"), # Googleのレスポンスにある住所
                    "latitude": spot["latitude"],
                    "longitude": spot["longitude"]
                }
                for spot in target_spots
            ]
            
            # 修正したメソッドにリッチな情報を渡す
            descriptions = await llm_service.explain_places(places_info)
            
        except Exception as e:
            print("⚠️ LLM skipped:", e)
            descriptions = {}

    # 3. 結果の結合
    enriched_spots = []
    for spot in spots:
        enriched_spots.append({
            **spot,
            "description": descriptions.get(spot["name"], "")
        })

    return {"spots": enriched_spots}