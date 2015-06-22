import json
from util import d
import os

__home = os.path.expanduser("~").replace('\\', '/') + "/PixelWeb/config/"
print __home

def initConfig():
    try:
        if not os.path.exists(__home):
            os.makedirs(__home)
    except:
        print "Failed to initialize PixelWeb config!"

def readConfig(file, key = None, path=__home):
    data = {}
    try:
        with open(path + "/" + file + ".json", "r") as fp:
            data = json.load(fp, encoding='utf-8')    
            if key:
                data = data[key]
    except Exception, e:
        pass
        
    return data

def writeConfig(file, key, data, path=__home):
    base = readConfig(file)
    base[key] = data
    with open(path + "/" + file + ".json", "w") as fp:
        json.dump(base, fp, indent=4, sort_keys=True)



