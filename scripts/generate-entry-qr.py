"""Generate the public test-entry QR locally; no user data or web QR service.

Development utility only (ReportLab + Pillow). The generated PNG is committed,
so neither Python nor these packages is required by the website/build.
"""
from pathlib import Path
from reportlab.graphics.barcode.qrencoder import QRCode, QRErrorCorrectLevel
from PIL import Image, ImageDraw

url = "https://jiaming27.cn/"
qr = QRCode(None, QRErrorCorrectLevel.M)
qr.addData(url)
qr.make()
quiet, scale = 4, 12
size = (qr.moduleCount + quiet * 2) * scale
image = Image.new("RGB", (size, size), "white")
draw = ImageDraw.Draw(image)
for y, row in enumerate(qr.modules):
    for x, value in enumerate(row):
        if value:
            left, top = (x + quiet) * scale, (y + quiet) * scale
            draw.rectangle((left, top, left + scale - 1, top + scale - 1), fill="#193c32")
image.save(Path(__file__).resolve().parents[1] / "public" / "type-entry-qr.png")
print(f"Generated {size}x{size} entry QR; contains only the canonical site URL.")
