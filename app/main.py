from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from slowapi.middleware import SlowAPIMiddleware

from app.api.routes import router
from app.core.limiter import limiter

app = FastAPI()

# 🔒 Attach rate limiter
app.state.limiter = limiter
app.add_middleware(SlowAPIMiddleware)

# 🌐 CORS (frontend access)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ⚠️ in production, restrict this
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 📡 Routes
app.include_router(router)


# 🏠 Health check
@app.get("/")
def root():
    return {"status": "ok"}