"""Traces the project photographs into the vector linework used by the blueprint drawings.
Build-time tool, not needed to run the site. Needs: pip install opencv-python-headless numpy
Usage (from the project root):  python3 tools/build_blueprints.py [output.js]
Writes js/blueprints.js. BOX = each building's bounds in the 1280x1024 photo."""
import cv2, numpy as np, json, math, sys, os
BOX = {  # subject bounds in 1280x1024 image space (x0,y0,x1,y1)
 'halden-exchange':(420,10,905,940), 'tallis-house':(10,100,1270,920), 'corvin-yard':(60,170,1280,700),
 'ashgrove-residences':(250,146,1280,830), 'the-ledger-building':(100,120,1230,930), 'brannock-works':(0,10,1260,670),
 'pell-street-lofts':(50,20,1250,880), 'north-quay-library':(10,160,1250,640)}
PARAM = {'default':dict(blur=1.2,lmin=22,contrast=16,keep=1500,cblur=1.6,clo=34,chi=95,cmin=70),
         'pell-street-lofts':dict(blur=1.9,lmin=34,contrast=24,keep=1100,cblur=2.6,clo=55,chi=150,cmin=90),
         'corvin-yard':dict(blur=1.6,lmin=30,contrast=20,keep=1300,cblur=2.8,clo=58,chi=145,cmin=90),
         'tallis-house':dict(blur=1.6,lmin=30,contrast=20,keep=1200,cblur=2.3,clo=45,chi=130,cmin=80),
         'ashgrove-residences':dict(blur=1.6,lmin=30,contrast=16,keep=1100,cblur=2.4,clo=38,chi=110,cmin=80),
         'the-ledger-building':dict(blur=1.3,lmin=26,contrast=18,keep=1500,cblur=1.8,clo=40,chi=110,cmin=70),
         'brannock-works':dict(blur=1.3,lmin=26,contrast=16,keep=1300,cblur=1.8,clo=36,chi=100,cmin=70)}
def run(name, preview=True):
    P = {**PARAM['default'], **PARAM.get(name,{})}
    img = cv2.imread(f'assets/img/projects/{name}.webp'); gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    g = cv2.GaussianBlur(gray, (0,0), P['blur'])
    det = cv2.createLineSegmentDetector(cv2.LSD_REFINE_STD)
    lines = det.detect(g)[0]
    lines = [] if lines is None else lines.reshape(-1,4)
    gx = cv2.Sobel(g, cv2.CV_32F, 1, 0); gy = cv2.Sobel(g, cv2.CV_32F, 0, 1); mag = np.hypot(gx, gy)/4
    x0,y0,x1,y1 = BOX[name]; segs=[]
    for a,b,c,d in lines:
        L = math.hypot(c-a, d-b)
        if L < P['lmin']: continue
        mx,my = (a+c)/2,(b+d)/2
        if not (x0-8<=mx<=x1+8 and y0-8<=my<=y1+8): continue
        t = np.linspace(0,1,max(6,int(L/6)))
        xs = np.clip((a+(c-a)*t).astype(int),0,1279); ys = np.clip((b+(d-b)*t).astype(int),0,1023)
        if mag[ys,xs].mean() < P['contrast']: continue
        segs.append((a,b,c,d,L))
    segs.sort(key=lambda s:-s[4]); segs = segs[:P['keep']]
    segs = [([ (a,b),(c,d) ], L) for a,b,c,d,L in segs]
    M = 36
    inside = lambda pts: all(x0-M<=x<=x1+M and y0-M<=y<=y1+M for x,y in pts)
    segs = [sg for sg in segs if inside(sg[0])]
    # contour polylines from Canny (curves, arches, small details)
    cg = cv2.GaussianBlur(gray,(0,0),P['cblur']); edges = cv2.Canny(cg, P['clo'], P['chi'])
    cn,_ = cv2.findContours(edges, cv2.RETR_LIST, cv2.CHAIN_APPROX_NONE)
    for c in cn:
        L = cv2.arcLength(c, False)/2
        if L < P['cmin']: continue
        ap = cv2.approxPolyDP(c, 2.0, False).reshape(-1,2)
        if len(ap) < 2: continue
        ext = math.hypot(ap[:,0].max()-ap[:,0].min(), ap[:,1].max()-ap[:,1].min())
        if len(ap)/max(L,1) > 0.075 or ext < 0.38*L: continue   # foliage and other tangles
        if not inside([(float(x),float(y)) for x,y in ap]): continue
        segs.append(([(float(x),float(y)) for x,y in ap], L))
    # red element outlines
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    red = (((hsv[...,0]<8)|(hsv[...,0]>172))&(hsv[...,1]>150)&(hsv[...,2]>70)).astype('uint8')*255
    red = cv2.morphologyEx(red, cv2.MORPH_CLOSE, np.ones((7,7),np.uint8))
    cnts,_ = cv2.findContours(red, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    polys=[]
    for c in cnts:
        if cv2.contourArea(c) < 500: continue
        ap = cv2.approxPolyDP(c, 4, True).reshape(-1,2)
        if len(ap) >= 3: polys.append([[int(x),int(y)] for x,y in ap])
    return segs, polys, P
def fmt(v): 
    s=('%.1f'%v); return s[:-2] if s.endswith('.0') else s
def chunk(segs, n):
    segs = sorted(segs, key=lambda s:sum(p[0] for p in s[0])/len(s[0]))
    if not segs: return []
    size = max(1, math.ceil(len(segs)/n)); out=[]
    for i in range(0,len(segs),size):
        part = segs[i:i+size]
        out.append(''.join('M'+'L'.join('%s %s'%(fmt(x),fmt(y)) for x,y in pts) for pts,_ in part))
    return out
if __name__=='__main__':
    data={}; 
    for name in BOX:
        segs,polys,P = run(name)
        heavy=[s for s in segs if s[1]>=70]; light=[s for s in segs if s[1]<70]
        data[name]={'heavy':chunk(heavy,22),'light':chunk(light,10),'red':polys}
        print(name, len(segs),'segs', len(heavy),'heavy', len(polys),'red polys')
    js = '/* ABSTRUCT — blueprint linework, traced from the project photographs (generated; see docs/blueprints.md) */\n(function(){window.ABS=window.ABS||{};ABS.bpData=' + json.dumps(data, separators=(',',':')) + ';})();\n'
    open(sys.argv[1] if len(sys.argv)>1 else 'js/blueprints.js','w').write(js)
