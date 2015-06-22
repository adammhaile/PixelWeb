import inspect

from bibliopixel import *
from bibliopixel.animation import *
import matrix_animations as ma
import loader
from util import d
import config
import os

def animationPredicate(obj):
    if not inspect.isclass(obj): return False
    return issubclass(obj, BaseAnimation)

def loadClasses(mod):
    results = []
    for name, obj in inspect.getmembers(mod, predicate=animationPredicate):
        if obj.__module__ == mod.__name__:
            results.append(d({"name":name, "cls":obj}))
    return results

def loadParams(cls):
    spec = inspect.getargspec(cls.__init__)
    args = list(reversed(spec.args))
    defaults = spec.defaults
    if not defaults: defaults = []
    defaults = list(reversed(list(defaults)))
    result = []
    count = 0
    for a in args:
        if a not in ["self", "led"]:
            d = None
            dtype = ""
            if count < len(defaults):
                d = defaults[count]
                if type(d) is int:
                    dtype = "int"
                elif type(d) is bool:
                    dtype = "bool"
                elif type(d) is str:
                    dtype = "str"
                elif (type(d) is list or type(d) is tuple) and len(d) == 3:
                    dtype = "color"
            i = {
                "id": a,
                "label": "",
                "type": dtype,
                "default": d,
                "help":""
            }
            result.append(i)
        count += 1
    return result

def getControllerType(cls):
    if issubclass(cls, BaseMatrixAnim): return "matrix"
    if issubclass(cls, BaseStripAnim): return "strip"
    if issubclass(cls, BaseCircleAnim): return "circle"
    return ""

outpath = os.path.dirname(os.path.abspath(__file__))
mods = loader.load_folder("C:/GitHub/BiblioPixelAnimations/strip/")

for m in mods:
    results = []
    for c in loadClasses(m):
        params = loadParams(c.cls)
        manifest = {
            "id":c.name,
            "class":c.name,
            "type": "animation",
            "display": c.name,
            "controller": getControllerType(c.cls),
            "params": params
        }
        results.append(manifest)
    if len(results) > 0:    
        config.writeConfig("manifest", m.__file__, results, path=outpath)


