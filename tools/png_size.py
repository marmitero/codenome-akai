import struct, sys, os

def png_size(path):
    try:
        with open(path, 'rb') as f:
            head = f.read(26)
        if head[:8] != b'\x89PNG\r\n\x1a\n':
            return None
        w, h = struct.unpack('>II', head[16:24])
        bit_depth, color_type = head[24], head[25]
        return (w, h, color_type)
    except Exception:
        return None

if __name__ == '__main__':
    for line in sys.stdin:
        p = line.strip()
        if not p: continue
        r = png_size(p)
        if r:
            print(f"{r[0]}x{r[1]}\tct={r[2]}\t{p}")
