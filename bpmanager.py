from bibliopixel import *
from bibliopixel.animation import BaseAnimation
from util import *
from static_objects import *
import loader
import config
import status

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

		self.controllers = {}
		self._contClasses = {}

		self.anims = {}
		self._animClasses = {}

		self._preConfigs = {}

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
		if "preconfig" not in config:
			config.preconfig = {}

	 	c = {
				"display":config.display,
				"desc":config.desc,
				"params":config.params,
				"presets": config.presets,
				"preconfig": config.preconfig
			}
		c = d(c)
		if config.type == "controller" or (config.type =="preset" and config.preset_type == "controller"):
			c.control_type = config.control_type
		return c

	def __loadDriverDef(self, config):
		config = d(config)
		self._driverClasses[config.id] = config['class']
		self.drivers[config.id] = self.__genModObj(config)

	def __loadControllerDef(self, config):
		config = d(config)
		self._contClasses[config.id] = config['class']
		self.controllers[config.id] = self.__genModObj(config)

	def __addToAnims(self, config, c):
		cont = config.controller
		if not cont in self.anims:
			self.anims[cont] = {}
		self.anims[cont][config.id] = c

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

		c = self.__genModObj(config)

		if config.preset_type == "driver":
			self.drivers[config.id] = c
		elif config.preset_type == "controller":
			self.controllers[config.id] = c
		elif config.preset_type == "animation":
			elf.__addToAnims(config, c)
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

	def loadPreConfig(self):
		config = []
		pre_config_dirs = config.readServerConfig().pre_config_dirs
		for dir in pre_config_dirs:
			config.extend(loader.load_folder(dir))
		for a in config:
			if hasattr(a, 'MANIFEST'):
				status.pushStatus("Loading: {}".format(a.__file__))
				for ref in a.MANIFEST:
					ref = d(ref)
					self.__loadAnimDef(ref)

	def startConfig(self, driverConfig, ledConfig):
		self.stopConfig();
		ledConfig = d(ledConfig)

		for drv in driverConfig:
			drv = d(drv)
			if not drv.id in self._driverClasses:
				return fail("Invalid Driver")

		if not ledConfig.id in self._contClasses:
			return fail("Invalid Controller")

		config.writeConfig("current_setup", driverConfig, "driver")
		config.writeConfig("current_setup", ledConfig, "controller")

		self._driverCfg = driverConfig
		self.driver = []
		for drv in driverConfig:
			drv = d(drv)
			self.driver.append(self._driverClasses[drv.id](**(drv.config)))
		self._ledCfg = ledConfig
		cfg = ledConfig.config
		cfg['driver'] = self.driver
		self.led = self._contClasses[ledConfig.id](**(cfg))
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

	def startAnim(self, config, run):
		try:
			self.stopAnim()
			config = d(config)
			run = d(run)

			if not config.id in self._animClasses:
				return fail("Invalid Animation")

			self._animCfg = config
			config.config.led = self.led
			self.anim = self._animClasses[config.id](**(config.config))

			run.threaded = True
			self.anim.run(**(run))

			return success()
		except:
			return fail(traceback.format_exc(), error=ErrorCode.BP_ERROR, data=None)
