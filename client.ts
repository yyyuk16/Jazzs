import math
import requests
from app.core.config import GOOGLE_MAPS_API_KEY

def calculate_distance(lat1, lon1, lat2, lon2):
    """
    Haversine式による距離計算（km）
    2点間の緯度経度から直線距離を求めます。
    """
    R = 6371  # 地球の半径（km）

    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)

    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad

    a = (
        math.sin(dlat / 2) ** 2
        + math.cos(lat1_rad)
        * math.cos(lat2_rad)
        * math.sin(dlon / 2) ** 2
    )

    c = 2 * math.asin(math.sqrt(a))
    return R * c


def search_nearby_spots(lat: float, lng: float, keyword: str, place_type: str = "") -> list:
    """
    Google Places API (New) の Text Search を使用して周辺スポットを検索します。
    旧API (Nearby Search) ではなく、v1 API を使用します。
    """
    # エンドポイント: v1 (New) を使用
    url = "https://places.googleapis.com/v1/places:searchText"

    # ヘッダー設定 (FieldMaskで必要なフィールドを指定)
    headers = {
        "Content-Type": "application/json",
        "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
        "X-Goog-FieldMask": "places.id,places.displayName,places.formattedAddress,places.location,places.rating"
    }

    # 検索クエリの作成
    # キーワードが空の場合はデフォルト値を設定
    search_query = keyword if keyword else "おすすめスポット"
    if place_type:
        search_query = f"{place_type} {search_query}"

    # リクエストボディ (JSON)
    payload = {
        "textQuery": search_query,
        "locationBias": {
            "circle": {
                "center": {
                    "latitude": lat,
                    "longitude": lng
                },
                "radius": 1500.0  # 半径1.5kmを優先
            }
        },
        "languageCode": "ja",
        "maxResultCount": 10
    }

    try:
        response = requests.post(url, json=payload, headers=headers)
        data = response.json()

        # 結果リストの作成
        results = []
        places_raw = data.get("places", [])

        for place in places_raw:
            try:
                # 座標の取得
                spot_lat = place["location"]["latitude"]
                spot_lng = place["location"]["longitude"]
                
                # 現在地からの距離を計算
                distance = calculate_distance(lat, lng, spot_lat, spot_lng)

                results.append({
                    "place_id": place["id"],
                    # New APIでは displayName.text に名前が入る
                    "name": place.get("displayName", {}).get("text", "名称不明"),
                    "latitude": spot_lat,
                    "longitude": spot_lng,
                    "distance": round(distance * 1000), # km -> m 変換
                    "rating": place.get("rating"),
                    # New APIでは formattedAddress に住所が入る
                    "vicinity": place.get("formattedAddress") 
                })
            except KeyError as e:
                print(f"Data Parse Warning: {e}")
                continue

        return results

    except Exception as e:
        print(f"Google Maps API Error: {e}")
        return []