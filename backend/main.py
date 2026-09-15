from fastapi import FastAPI

app = FastAPI(title="VIGILANT Backend")


@app.get("/")
def home():
    return {
        "message": "VIGILANT backend is running!"
    }