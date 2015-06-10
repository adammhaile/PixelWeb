import loader
import sys
mods = loader.load_folder("G:/Misc/")
#import package.thing
#package.thing.do()
print mods
for m in mods:
	m = mods[m]
	if hasattr(m, 'MANIFEST'):
		print m.MANIFEST

# mod = loader.load_module("C:/GitHub/BPTest/b.py")
# print mod.thing(1,3)
