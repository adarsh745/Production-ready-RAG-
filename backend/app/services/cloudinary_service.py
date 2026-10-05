import os
import cloudinary
import cloudinary.uploader
from io import BytesIO

# Configure Cloudinary credentials from environment variables
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET"),
    secure=True
)


def upload_avatar_to_cloudinary(file_content: bytes, filename: str) -> str:
    """
    Uploads user profile picture to Cloudinary CDN and returns the secure URL.
    """
    try:
        response = cloudinary.uploader.upload(
            file_content,
            folder="rag_profile_avatars",
            public_id=f"avatar_{filename.split('.')[0]}",
            overwrite=True,
            resource_type="image",
            transformation=[
                {"width": 400, "height": 400, "crop": "fill", "gravity": "face"}
            ]
        )
        secure_url = response.get("secure_url")
        print(f"✅ Cloudinary Upload Success: {secure_url}")
        return secure_url
    except Exception as e:
        print(f"❌ Cloudinary Upload Failed: {e}")
        raise RuntimeError(f"Cloudinary upload error: {str(e)}")
