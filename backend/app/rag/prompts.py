# Never keep prompts inside Python logic.

# Tomorrow your prompt becomes

# 200 lines

# Your summarizer becomes unreadable.


SEARCHABLE_SUMMARY_PROMPT = """
You are creating a searchable description for document retrieval.

CONTENT

TEXT
{text}

TABLES
{tables}

Generate a searchable description covering

1. Main topics
2. Key facts
3. Important numbers
4. Questions this section can answer
5. Important keywords
6. Visual description if images exist

Return only the description.
"""