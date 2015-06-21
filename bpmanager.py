from bibliopixel import *
from bibliopixel.animation import BaseAnimation
from util import *
from static_objects import *
import loader

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

		self.animRunParams = BaseAnimation.RUN_PARAMS

		self.__loadFuncs = {
			"driver" : self.__loadDriverDef,
			"controller" : self.__loadControllerDef,
			"animation" : self.__loadAnimDef

		}

	def __loadDriverDef(self, config):
		config = d(config)
		self._driverClasses[config.id] = config['class']
		c = {"display":config.display, "params":config.params}
		self.drivers[config.id] = c

	def __loadControllerDef(self, config):
		config = d(config)
		self._contClasses[config.id] = config['class']
		c = {"display":config.display, "params":config.params}
		self.controllers[config.id] = c

	def __loadAnimDef(self, config):
		config = d(config)
		self._animClasses[config.id] = config['class']
		c = {"display":config.display, "params":config.params}
		cont = config.controller
		if not cont in self.anims:
			self.anims[cont] = {}
		self.anims[cont][config.id] = c

	def loadModules(self):
		mods = moduleList
		anims = loader.load_folder("C:/GitHub/BiblioPixelAnimations/strip/")
		mods.extend(anims)
		for m in mods:
			if hasattr(m, 'MANIFEST'):
				for ref in m.MANIFEST:
					ref = d(ref)
					if ref.type in self.__loadFuncs:
						self.__loadFuncs[ref.type](ref)

	def startConfig(self, driverConfig, ledConfig):
		self.stopConfig();
		ledConfig = d(ledConfig)

		for drv in driverConfig:
			drv = d(drv)
			if not drv.id in self._driverClasses:
				return fail("Invalid Driver")
		
		if not ledConfig.id in self._contClasses:
			return fail("Invalid Controller")

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

	def stopConfig(self):
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







