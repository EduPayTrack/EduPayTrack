import sys
import json
import os

# Force UTF-8 output to prevent Windows charmap errors from Unicode progress bars
sys.stdout = open(sys.stdout.fileno(), mode='w', encoding='utf-8', buffering=1)
sys.stderr = open(sys.stderr.fileno(), mode='w', encoding='utf-8', buffering=1)

import easyocr

def scan_receipt(image_path):
    # verbose=False suppresses Unicode progress bar that crashes on Windows charmap
    reader = easyocr.Reader(['en'], verbose=False)
    results = reader.readtext(image_path, detail=0)
    return " ".join(results)

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No image path provided"}))
        sys.exit(1)
        
    img_path = sys.argv[1]
    
    if not os.path.exists(img_path):
        print(json.dumps({"error": f"File not found: {img_path}"}))
        sys.exit(1)
        
    try:
        raw_text = scan_receipt(img_path)
        print(json.dumps({"rawText": raw_text}))
    except Exception as e:
        print(json.dumps({"error": str(e)}))
        sys.exit(1)
