import os
from openai import OpenAI

from dotenv import load_dotenv, find_dotenv
_ = load_dotenv(find_dotenv())

client = OpenAI()
response = client.chat.completions.create(
    messages=[{"role": "user", "content": "你是谁?"}],
    model="gpt-3.5-turbo",
)

print(response.choices[0].message.content)
