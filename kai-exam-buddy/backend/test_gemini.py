import asyncio
from openai import AsyncOpenAI

async def test():
    client = AsyncOpenAI(
        api_key="AIzaSyCqJPpnMe87wGvw60PV6Q1bydHWmMfnCro",
        base_url="https://generativelanguage.googleapis.com/v1beta/openai/"
    )
    models = ["gemini-2.5-flash", "gemini-1.5-pro-latest", "gemini-pro", "gemini-1.5-flash-8b"]
    for model in models:
        try:
            print(f"Testing {model}...")
            response = await client.chat.completions.create(
                model=model,
                messages=[{"role": "user", "content": "Hello"}],
            )
            print("SUCCESS:", response.choices[0].message.content)
            return model
        except Exception as e:
            print(f"FAILED {model}: {e}")

if __name__ == "__main__":
    asyncio.run(test())
