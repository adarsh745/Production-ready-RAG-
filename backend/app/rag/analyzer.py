# This file analyzes a chunk.
# It tells us
# Is there text?
# Is there a table?
# Is there an image?
# It does not call GPT.


def separate_content_types(chunk):
    """Analyze what types of content are in a chunk"""

    content_data = {
        "text": chunk.text,
        "tables": [],
        "images": [],
        "types": ["text"]
    }

    if hasattr(chunk, "metadata") and hasattr(chunk.metadata, "orig_elements"):

        for element in chunk.metadata.orig_elements:

            element_type = type(element).__name__

            if element_type == "Table":

                content_data["types"].append("table")

                table_html = getattr(
                    element.metadata,
                    "text_as_html",
                    element.text
                )

                content_data["tables"].append(table_html)

            elif element_type == "Image":

                if (
                    hasattr(element, "metadata")
                    and hasattr(element.metadata, "image_base64")
                ):

                    content_data["types"].append("image")

                    content_data["images"].append(
                        element.metadata.image_base64
                    )

    content_data["types"] = list(set(content_data["types"]))

    return content_data