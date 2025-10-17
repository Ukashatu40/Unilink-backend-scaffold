from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from transformers import pipeline
import uvicorn

app = FastAPI(title="Smart Travel Sentiment API")

# Load model once at startup
sentiment_pipeline = pipeline("sentiment-analysis", model="distilbert/distilbert-base-uncased-finetuned-sst-2-english")


class TextRequest(BaseModel):
    text: str

@app.post("/predict")
def predict_sentiment(request: TextRequest):
    try:
        result = sentiment_pipeline(request.text)[0]
        label = result["label"].lower()
        confidence = round(result["score"], 2)

        # Simple keyword explanation mock
        words = request.text.split()
        explanation = [w for w in words if len(w) > 4][:3]

        return {"label": label, "confidence": confidence, "explanation": explanation}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
