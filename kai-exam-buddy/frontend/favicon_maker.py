from PIL import Image
import os

def create_favicons():
    # The true newly uploaded test image
    source_path = r"C:\Users\prana\.gemini\antigravity\brain\ca9edb40-2f4e-4958-91ba-c36429e7f15d\media__1772384416286.png"
    dest_dir = r"e:\Hushh.Ai\kai-exam-buddy\frontend\public"
    
    os.makedirs(dest_dir, exist_ok=True)
    
    # Simple direct resize since the user uploaded exactly the symbol they wanted
    img = Image.open(source_path).convert("RGBA")
    
    # Save base logo
    img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(dest_dir, "logo.png"))
    
    sizes = {
        "favicon-16x16.png": (16, 16),
        "favicon-32x32.png": (32, 32),
        "apple-touch-icon.png": (180, 180)
    }
    
    for filename, dim in sizes.items():
        resized = img.resize(dim, Image.Resampling.LANCZOS)
        resized.save(os.path.join(dest_dir, filename))
        
    ico_path = os.path.join(dest_dir, "favicon.ico")
    icon_sizes = [(16, 16), (32, 32), (48, 48), (64, 64)]
    img.save(ico_path, format="ICO", sizes=icon_sizes)
    print("SUCCESS")

if __name__ == "__main__":
    create_favicons()
