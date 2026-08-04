from fastapi import APIRouter

router = APIRouter()

@router.get("/")
async def health():

    return {
        "status": "success",
        "message": "Backend Running Successfully"
    }