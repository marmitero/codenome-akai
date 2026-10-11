import os, struct, collections, json, sys

ROOT = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.dirname(ROOT)

def png_size(path):
    try:
        with open(path,'rb') as f: h=f.read(26)
        if h[:8]!=b'\x89PNG\r\n\x1a\n': return None
        w,hh=struct.unpack('>II',h[16:24]); return w,hh
    except Exception: return None

packs = collections.OrderedDict()
for name in sorted(os.listdir(ROOT)):
    p = os.path.join(ROOT,name)
    if not os.path.isdir(p) or name.startswith('.'): continue
    files=[]
    for dp,dn,fn in os.walk(p):
        if '__MACOSX' in dp: continue
        for f in fn:
            if f.lower().endswith('.png'):
                files.append(os.path.relpath(os.path.join(dp,f), ROOT))
    packs[name]=files

out={}
for pack,files in packs.items():
    sizes=collections.Counter()
    for f in files[:400]:
        s=png_size(os.path.join(ROOT,f))
        if s: sizes[s]+=1
    ext=collections.Counter(os.path.splitext(f)[1].lower() for f in files)
    out[pack]={'png_total':len(files),'top_sizes':sizes.most_common(6)}
for k,v in out.items():
    print(f"{k}: png={v['png_total']} sizes={v['top_sizes']}")
