import json
from util import d
import os

__home = os.path.expanduser("~").replace('\\', '/') + "/PixelWeb/"

BASE_SERVER_CONFIG = d({
            "id":"server_config",
            "display": "server_config",
            "preconfig": False,
            "presets":[],
            "params": [{
                "id": "external_access",
                "label": "Allow External Access",
                "type": "bool",
                "default": False,
                "help":"On: Other computers on your network can access PixelWeb. Off: Local access only."
            },{
                "id": "port",
                "label": "Server Port",
                "type": "int",
                "default": 8080,
                "help":"Port to listen on."
            },{
                "id": "load_defaults",
                "label": "Load Last Config on Start",
                "type": "bool",
                "default": False,
                "help":"Load last driver/controller configuration on application start."
            },
            {
                "id": "show_debug",
                "label": "Show Debug in Console",
                "type": "bool",
                "default": False,
                "help":"Show BiblioPixel debug in server console (not in main UI)."
            },{
                "id": "mod_dirs",
                "label": "Module Directories",
                "type": "str_multi",
                "default": [],
                "help":"Directories from which to load modules (animations, drivers, controllers, pre-configs).",
                "replace": {"\\":"/"}
            },]
        });

def initConfig():
    try:
        if not os.path.exists(__home):
            print "Creating {}".format(__home)
            os.makedirs(__home)
    except:
        print "Failed to initialize PixelWeb config!"

def readConfig(file, key = None, path=__home):
    data = {}
    try:
        with open(path + "/" + file + ".json", "r") as fp:
            data = json.load(fp, encoding='utf-8')
            if key:
                if key in data:
                    data = data[key]
                else:
                    data = {}
    except Exception, e:
        pass

    return d(data)

def writeConfig(file, data, key = None, path=__home):
    base = data
    if key:
        base = readConfig(file, path=path)
        base[key] = data
    with open(path + "/" + file + ".json", "w") as fp:
        json.dump(base, fp, indent=4, sort_keys=True)

def paramsToDict(params):
    data = {}
    for p in params:
        if "default" not in p:
            p.default = None
        data[p.id] = p.default
    return data

def readServerConfig():
    data = readConfig("config", path=__home)
    base = paramsToDict(BASE_SERVER_CONFIG.params)
    if len(data.keys()) == 0:
        data = paramsToDict(BASE_SERVER_CONFIG.params)
    elif len(data.keys()) != len(base.keys()):
        data.upgrade(base)
    return d(data)

def writeServerConfig(data):
    writeConfig("config", data)
