"""Extract the first frame of each row of a spritesheet and stack them vertically,
scaled up, so the 4-direction row order can be inspected visually."""
import sys
from PIL import Image

src, out = sys.argv[1], sys.argv[2]
fw = int(sys.argv[3]) if len(sys.argv) > 3 else 64
fh = int(sys.argv[4]) if len(sys.argv) > 4 else 64
scale = int(sys.argv[5]) if len(sys.argv) > 5 else 4

im = Image.open(src).convert('RGBA')
rows = im.height // fh
cols = im.width // fw
strip = Image.new('RGBA', (fw, fh * rows), (20, 20, 30, 255))
for r in range(rows):
    frame = im.crop((0, r * fh, fw, (r + 1) * fh))
    strip.paste(frame, (0, r * fh), frame)
strip = strip.resize((fw * scale, fh * rows * scale), Image.NEAREST)
strip.save(out)
print(f"{src} -> {out}  cols={cols} rows={rows} frame={fw}x{fh}")
