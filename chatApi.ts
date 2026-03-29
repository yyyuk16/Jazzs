import os
import json
from google import genai
from google.genai import types
from app.models.schema import SearchIntent, RecommendationResult

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

class LLMService:
    def __init__(self):
        self.model_name = "gemini-3-flash-preview"

    async def explain_places(self, places_data: list[dict]) -> dict[str, str]:
        places_str = json.dumps(places_data, ensure_ascii=False, indent=2)

        prompt = f"""
以下の観光地リストについて、それぞれの場所の観光案内文を
日本語で200文字以内にまとめて書いてください。

## 入力データ
{places_str}

## 制約事項
・前置きや挨拶は不要
・各説明は簡潔に、魅力が伝わるように
・キーは入力データの "name" をそのまま使用すること
・出力は必ず以下の JSON 形式のみにする

## 出力形式（厳守）
{{
  "場所名1": "説明文...",
  "場所名2": "説明文..."
}}
"""

        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
            )
        )

        try:
            return json.loads(response.text)
        except json.JSONDecodeError:
            print("🔥 JSON parse failed:", response.text)
            return {}

    # ================================
    # チャット機能 api 用 llm（意図解析）
    # ================================
    async def analyze_intent(self, chat_text: str) -> SearchIntent:
        prompt = f"""
あなたはローカル観光アプリの検索意図解析AIです。

ユーザーの入力は、雑談・感想・気分表現を含みます。
完璧に理解できなくても問題ありません。

【あなたの役割】
ユーザーの発言を、Google Places API で検索できる
「検索キーワード」と「place type」に変換してください。

【place_type の制約】
以下の中から1つだけ選んでください：
- restaurant
- cafe
- park
- tourist_attraction
- bar
- shopping_mall
- museum
- null

【keyword のルール】
- 日本語
- 1〜3語程度
- 雰囲気・目的を表す

【禁止事項】
- 固有の地名を出さない
- 海外・都市名を出さない
- 説明文を書かない

ユーザー入力:
「{chat_text}」

必ず以下の JSON 形式のみで出力してください。

{{
  "keyword": string | null,
  "place_type": string | null
}}
"""

        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                temperature=0.2,
            ),
        )

        try:
            return SearchIntent.model_validate_json(response.text)
        except Exception:
            print("🔥 analyze_intent parse error:", response.text)
            return SearchIntent(keyword=None, place_type=None)

    # ================================
    # チャット機能 api 用 llm（推薦選択）
    # ================================
    async def select_recommendation(
        self,
        chat_text: str,
        spots: list
    ) -> RecommendationResult:

        spots_summary = [
            {"id": s["place_id"], "name": s["name"], "rating": s.get("rating")}
            for s in spots
        ]

        prompt = f"""
あなたは優秀な観光コンシェルジュです。
ユーザーの要望: "{chat_text}"

以下の候補リストから、この要望に最も合致するスポットを1つだけ選んでください。
そして理由を「親しみやすい口調」で150文字以内で説明してください。

候補リスト:
{json.dumps(spots_summary, ensure_ascii=False)}
"""

        response = client.models.generate_content(
            model=self.model_name,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_mime_type="application/json",
                response_schema=RecommendationResult,
            ),
        )

        return response.parsed


llm_service = LLMService()
