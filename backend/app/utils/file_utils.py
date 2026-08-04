# this is from file utils to save file in folder
import os

from fastapi import UploadFile

UPLOAD_FOLDER = "app/uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


async def save_uploaded_file(file: UploadFile):
    
    print("this is from file utils to save file in folder", file.filename)

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        buffer.write(await file.read())

    return file_path