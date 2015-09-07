from bibliopixel import *
from bibliopixel.animation import BaseAnimation, AnimationQueue
from util import *
from static_objects import *
import loader
import config
import status
import traceback

class BPManager:
	def __init__(self):
		self.driver = []
		self._driverCfg = None
		self.led = None
		self._ledCfg = None
		self.anim = None
		self._animCfg = None

		self.drivers = {}
		self._driverClasses = {}
		self._driverNames = {}

		self.controllers = {}
		self._contClasses = {}
		self._contNames = {}

		self.anims = {}
		self._animClasses = {}
		self._animNames = {}

		self._preConfigs = {}
		self._preNames = {}

		self.animRunParams = BaseAnimation.RUN_PARAMS

		self.__loadFuncs = {
			"driver" : self.__loadDriverDef,
			"controller" : self.__loadControllerDef,
			"animation" : self.__loadAnimDef,
			"preset": self.__loadPresetDef

		}

		config.initConfig()

	def __genModObj(self, config):
		if "desc" not in config: config.desc = ""
		if "presets" not in config:
			config.presets = []
		if "params" not in config:
			config.params = []

	 	c = {
				"display":config.display,
				"desc":config.desc,
				"params":config.params,
				"presets": config.presets,
			}
		c = d(c)
		if config.type == "controller" or (config.type =="preset" and config.preset_type == "controller"):
			c.control_type = config.control_type
		return c

	def __loadDriverDef(self, config):
		config = d(config)
		self._driverClasses[config.id] = config['class']
		self.drivers[config.id] = self.__genModObj(config)
		self._driverNames[config.id] = config.display;

	def __loadControllerDef(self, config):
		config = d(config)
		self._contClasses[config.id] = config['class']
		self.controllers[config.id] = self.__genModObj(config)
		self._contNames[config.id] = config.display;

	def __addToAnims(self, config, c):
		cont = config.controller
		if not cont in self.anims:
			self.anims[cont] = {}
		self.anims[cont][config.id] = c
		self._animNames[config.id] = config.display;

	def __loadAnimDef(self, config):
		config = d(config)
		self._animClasses[config.id] = config['class']
		self.__addToAnims(config, self.__genModObj(config))

	def __loadPresetDef(self, config):
		config = d(config)
		config.id = "*!#_" + config.id
		config.display = "* " + config.display

		self._preConfigs[config.id] = {
			"class": config['class'],
			"preconfig": config.preconfig
		}

		self._preNames[config.id] = config.display;

		c = self.__genModObj(config)

		if config.preset_type == "driver":
			self.drivers[config.id] = c
			self._driverNames[config.id] = config.display;
		elif config.preset_type == "controller":
			self.controllers[config.id] = c
			self._contNames[config.id] = config.display;
		elif config.preset_type == "animation":
			self.__addToAnims(config, c)
		else:
			return

	def loadModules(self, mods):
		for m in mods:
			if hasattr(m, 'MANIFEST'):
				status.pushStatus("Loading: {}".format(m.__file__))
				for ref in m.MANIFEST:
					ref = d(ref)
					if ref.type in self.__loadFuncs:
						self.__loadFuncs[ref.type](ref)

	def loadBaseMods(self):
		self.loadModules(moduleList)

	def loadMods(self):
		mods = []
		mod_dirs = config.readServerConfig().mod_dirs
		for dir in mod_dirs:
			self.loadModules(loader.load_folder(dir))

	def __getInstance(self, config, inst_type):
		config = d(config)
		params = d(config.config)
		result = None
		obj = None
		preconfig = None
		if config.id in self._preConfigs:
			p = self._preConfigs[config.id]
			obj = p['class']
			preconfig = p['preconfig']
		else:
			if inst_type == "driver":
				if config.id in self._driverClasses:
					obj = self._driverClasses[config.id]
			elif inst_type == "controller":
				if config.id in self._contClasses:
					obj = self._contClasses[config.id]
			elif inst_type == "animation":
				if config.id in self._animClasses:
					obj = self._animClasses[config.id]

		if not obj:
			raise Exception("Invalid " + inst_type)

		if preconfig:
			if hasattr(preconfig, '__call__'):
				preconfig = preconfig()
			params.upgrade(preconfig)

		return (obj, params)

	def startConfig(self, driverConfig, ledConfig):
		self.stopConfig();
		self._driverCfg = driverConfig
		self._ledCfg = d(ledConfig)

		config.writeConfig("current_setup", self._driverCfg, "driver")
		config.writeConfig("current_setup", self._ledCfg, "controller")


		self.driver = []
		for drv in self._driverCfg:
			obj, params = self.__getInstance(d(drv), "driver")
			self.driver.append(obj(**(params)))

		obj, params = self.__getInstance(self._ledCfg, "controller")
		params['driver'] = self.driver
		self.led = obj(**(params))
		return success()

	def getConfig(self):
		setup = d(config.readConfig("current_setup"))
		if not ("driver" in setup): setup.driver = None
		if not ("controller" in setup): setup.controller = None
		return setup

	def stopConfig(self):
		self.stopAnim()
		if len(self.driver) > 0:
			for drv in self.driver:
				drv.cleanup()
			self.driver = []
			self._driverCfg = None
		if self.led:
			self.led.cleanup()
			self.led = None
			self._ledCfg = None

	def stopAnim(self):
		if self.anim:
			self.anim.cleanup()
			self.anim = None
			self._animCfg = None

	def startAnim(self, config):
		def getAnim(c):
			cfg = d(c['config'])
			run = d(c['run'])

			cfg.led = self.led
			c['config'] = cfg
			obj, params = self.__getInstance(c, "animation")
			print obj
			print params
			anim = obj(**(params))
			return anim, d(run)

		try:
			self.stopAnim()
			self._animCfg = config
			if('queue' in config):
				q = config['queue']
				run = d(config['run'])
				run.threaded = True
				self.anim = AnimationQueue(self.led)
				for a in q:
					anim, r = getAnim(a)
					self.anim.addAnim(
						anim=anim,
						amt = r.amt,
						fps = r.fps,
						max_steps = r.max_steps,
						untilComplete = r.untilComplete,
						max_cycles = r.max_cycles)
				status.pushStatus("Starting Animation Queue")
				self.anim.run(**(run))
				return success()
			else:
				self.anim, run = getAnim(config)
				run.threaded = True
				status.pushStatus("Starting Animation: {}".format(self._animNames[config.id]))
				self.anim.run(**(run))

				return success()
		except:
			return fail(traceback.format_exc(), error=ErrorCode.BP_ERROR, data=None)
