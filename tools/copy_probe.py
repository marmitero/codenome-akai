from PIL import Image
import sys, shutil
src, out = sys.argv[1], sys.argv[2]
scale = int(sys.argv[3]) if len(sys.argv) > 3 else 2
im = Image.open(src).convert('RGBA')
im2 = im.resize((im.width*scale, im.height*scale), Image.NEAREST)
im2.save(out)
print(out, im.size)
