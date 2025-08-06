# ocr/latex_ocr.py
import sys
from transformers import TrOCRProcessor, VisionEncoderDecoderModel
from PIL import Image
import torch

def run_ocr(image_path):
    processor = TrOCRProcessor.from_pretrained("microsoft/trocr-base-handwritten")
    model = VisionEncoderDecoderModel.from_pretrained("microsoft/trocr-base-handwritten")
    image = Image.open(image_path).convert("RGB")
    pixel_values = processor(images=image, return_tensors="pt").pixel_values
    generated_ids = model.generate(pixel_values)
    generated_text = processor.batch_decode(generated_ids, skip_special_tokens=True)[0]
    return generated_text

if __name__ == "__main__":
    image_path = sys.argv[1]
    try:
        print(run_ocr(image_path))
    except Exception as e:
        print(f"ERROR: {e}", file=sys.stderr)
        sys.exit(1)
