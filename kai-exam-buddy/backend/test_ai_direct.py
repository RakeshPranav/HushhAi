import asyncio
from services.ai_service import generate_study_material

async def test():
    try:
        res = await generate_study_material("Photosynthesis is important.", retries=0)
        print("SUCCESS:", res)
    except Exception as e:
        print("ERROR:", e)
        import traceback
        traceback.print_exc()

if __name__ == "__main__":
    asyncio.run(test())
