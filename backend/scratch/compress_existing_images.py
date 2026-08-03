import os
import sys
import django

# Set up Django environment
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

import io
import base64
from PIL import Image
from api.models import ExecutiveLeader

def compress_base64_image(base64_str, max_size=(256, 256), quality=70):
    if not base64_str or not isinstance(base64_str, str):
        return base64_str
    if not base64_str.startswith("data:"):
        return base64_str
    
    try:
        # Find the comma separating headers from data
        if "," not in base64_str:
            return base64_str
        header, data_part = base64_str.split(",", 1)
        
        # Decode base64 data
        img_data = base64.b64decode(data_part)
        
        # Open with PIL
        img = Image.open(io.BytesIO(img_data))
        
        # Convert modes (like RGBA/P) to RGB for JPEG compatibility
        if img.mode in ("RGBA", "P"):
            img = img.convert("RGB")
            
        # Downscale to thumbnail
        img.thumbnail(max_size, Image.Resampling.LANCZOS)
        
        # Save to buffer as compressed JPEG
        buf = io.BytesIO()
        img.save(buf, format="JPEG", quality=quality, optimize=True)
        compressed_bytes = buf.getvalue()
        
        # Re-encode to base64
        encoded = base64.b64encode(compressed_bytes).decode('utf-8')
        return f"data:image/jpeg;base64,{encoded}"
    except Exception as e:
        print(f"Error compressing image: {e}")
        return base64_str

def main():
    leaders = ExecutiveLeader.objects.all()
    print(f"Found {leaders.count()} leaders in database.")
    
    total_original_len = 0
    total_compressed_len = 0
    
    for l in leaders:
        if not l.image or not isinstance(l.image.name, str):
            print(f"Skipping {l.name} - no image.")
            continue
            
        orig_len = len(l.image.name)
        total_original_len += orig_len
        
        if orig_len < 50000:
            print(f"Skipping {l.name} - image already small ({orig_len} chars).")
            total_compressed_len += orig_len
            continue
            
        print(f"Compressing {l.name} ({orig_len} chars)...")
        compressed_base64 = compress_base64_image(l.image.name)
        new_len = len(compressed_base64)
        total_compressed_len += new_len
        
        print(f"-> New size: {new_len} chars (reduced by {((orig_len - new_len) / orig_len) * 100:.1f}%)")
        
        # Update in database directly
        l.image = compressed_base64
        l.save()
        
    print("====================================")
    print(f"Total original size: {total_original_len} chars")
    print(f"Total compressed size: {total_compressed_len} chars")
    print(f"Overall reduction: {((total_original_len - total_compressed_len) / total_original_len) * 100:.1f}%")

if __name__ == '__main__':
    main()
