# this is from file utils to save file in folder
import os

from fastapi import UploadFile

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


async def save_uploaded_file(file: UploadFile) -> str:
    
    print("this is from file utils to save file in folder", file.filename)

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        while chunk := await file.read(1024 * 1024):
            buffer.write(chunk)

    return file_path