import os
data_dirs = []
for root, dirs, files in os.walk("./pixelweb/ui"):
    base = root.replace("\\","/").replace("./pixelweb/", "")
    for f in files:
        data_dirs.append(base + "/" + f)
