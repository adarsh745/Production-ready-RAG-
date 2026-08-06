import cloudinary
import cloudinary.uploader
from io import BytesIO

# Configure Cloudinary credentials provided by user
cloudinary.config(
    cloud_name="dgi8ryvl",
    api_key="838218926839655",
    api_secret="iPpEEk63-avSvIq2xxczw858DKw",
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
