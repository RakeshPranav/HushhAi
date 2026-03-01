import httpx
import asyncio
import json

async def test():
    async with httpx.AsyncClient(timeout=60.0) as client:
        print("Uploading document...")
        files = {'file': ('test.txt', b'''
        Photosynthesis is the process used by plants, algae and certain bacteria to harness energy from sunlight and turn it into chemical energy.
        Here are the key points:
        1. It takes place in chloroplasts.
        2. Requires sunlight, carbon dioxide, and water.
        3. Produces glucose and oxygen.
        4. Chlorophyll is the green pigment responsible.
        5. It is essential for life on Earth.
        ''', 'text/plain')}
        res1 = await client.post('http://localhost:8000/api/upload/', files=files)
        print("Upload Status:", res1.status_code)
        doc_id = res1.json().get('id')
        print("Doc ID:", doc_id)
        
        print("\nGenerating study material (Summary)...")
        res2 = await client.post(f'http://localhost:8000/api/ai/{doc_id}/generate-summary')
        print("Summary Status:", res2.status_code)
        try:
            print(json.dumps(res2.json(), indent=2))
        except:
            print(res2.text)
            
        print("\nGenerating study material (Quiz)...")
        res3 = await client.post(f'http://localhost:8000/api/ai/{doc_id}/generate-quiz')
        print("Quiz Status:", res3.status_code)
        try:
            print(json.dumps(res3.json(), indent=2))
        except:
            print(res3.text)

if __name__ == "__main__":
    asyncio.run(test())
