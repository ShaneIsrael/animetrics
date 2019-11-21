#!/usr/bin/env python3
import json
import cv2
import sys
import os.path

def detect(filename, cascade_file = "./config/libcascade_animeface.xml"):
    if not os.path.isfile(cascade_file):
        raise RuntimeError("%s: not found" % cascade_file)

    cascade = cv2.CascadeClassifier(cascade_file)
    image = cv2.imread(filename, cv2.IMREAD_COLOR)
    gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
    gray = cv2.equalizeHist(gray)
    
    faces = cascade.detectMultiScale(gray,
                                     # detector options
                                     scaleFactor = 1.1,
                                     minNeighbors = 2,
                                     minSize = (24, 24))
    print('Found {} faces'.format(len(faces)))
    if len(faces) == 0: return
    face_data = []
    for (x, y, w, h) in faces:
        print(x, y, w, h)
        cv2.rectangle(image, (x, y), (x + w, y + h), (0, 0, 255), 2)
        face_data.append({'x': int(x), 'y': int(y), 'width': int(w), 'height': int(h)})
    
    fn, ext = os.path.splitext(filename)
    with open(fn + '_faces.json', 'w') as f:
        print(face_data)
        f.write(json.dumps(face_data))
    cv2.imwrite(fn + '_detected.jpg', image)
    print(fn)

if len(sys.argv) != 3:
    sys.stderr.write("usage: detect.py <filename> <conf>\n")
    sys.exit(-1)
    
detect(sys.argv[1], sys.argv[2])
