from PIL import Image
import sys, json
src = sys.argv[1]
min_area = int(sys.argv[2]) if len(sys.argv)>2 else 40
im = Image.open(src).convert('RGBA')
w,h = im.size
px = im.load()
mask = bytearray(w*h)
for y in range(h):
    for x in range(w):
        mask[y*w+x] = 1 if px[x,y][3] > 30 else 0
label = [-1]*(w*h)
comps=[]
from collections import deque
n=0
for i in range(w*h):
    if mask[i] and label[i]==-1:
        q=deque([i]); label[i]=n
        xs=[]; ys=[]
        while q:
            c=q.popleft(); cx, cy = c%w, c//w
            xs.append(cx); ys.append(cy)
            for dx,dy in ((1,0),(-1,0),(0,1),(0,-1)):
                nx_,ny_=cx+dx,cy+dy
                if 0<=nx_<w and 0<=ny_<h:
                    j=ny_*w+nx_
                    if mask[j] and label[j]==-1:
                        label[j]=n; q.append(j)
        if len(xs)>=min_area:
            comps.append({'x0':min(xs),'y0':min(ys),'x1':max(xs)+1,'y1':max(ys)+1,'area':len(xs)})
        n+=1
comps.sort(key=lambda c:(c['y0'],c['x0']))
print(json.dumps(comps))
