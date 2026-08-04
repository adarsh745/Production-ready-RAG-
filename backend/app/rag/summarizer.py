# This file creates a searchable summary for a chunk.

# It does NOT embed.

# It does NOT save to database.

# It just creates ONE searchable description using GPT-4o.


from langchain_openai import ChatOpenAI
from langchain_core.messages import HumanMessage
from app.rag.prompts import SEARCHABLE_SUMMARY_PROMPT
from langchain_openai import ChatOpenAI
# Create one LLM instance
llm = ChatOpenAI(
            model="gpt-4o",
            temperature=0
        )


def create_ai_summary(content_data):

    text = content_data["text"]

    tables = content_data["tables"]

    images = content_data["images"]

    prompt = SEARCHABLE_SUMMARY_PROMPT.format(
        text=text,
        tables="\n".join(tables)
    )

    message_content = [
        {
            "type": "text",
            "text": prompt
        }
    ]

    for image in images:

        message_content.append(
            {
                "type": "image_url",
                "image_url": {
                    "url": f"data:image/jpeg;base64,{image}"
                }
            }
        )

    response = llm.invoke(
        [
            HumanMessage(
                content=message_content
            )
        ]
    )

    return response.content