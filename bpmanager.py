from bibliopixel import *
from util import *

class BPManager:
	def __init__(self):
		self.driver = None
		self._driverCfg = None
		self.led = None
		self._ledCfg = None

		self.drivers = {}
		self._driverClasses = {}
		self.controllers = {}
		self._contClasses = {}

		self.__loadFuncs = {
			"driver" : self.__loadDriverDef,
			"controller" : self.__loadControllerDef
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

	def loadModules(self, mods):
		for m in mods:
			if hasattr(m, 'MANIFEST'):
				for ref in m.MANIFEST:
					ref = d(ref)
					if ref.type in self.__loadFuncs:
						self.__loadFuncs[ref.type](ref)

	def startConfig(self, driverConfig, ledConfig):
		self.stopConfig();
		driverConfig = d(driverConfig)
		ledConfig = d(ledConfig)

		if not driverConfig.id in self._driverClasses:
			return fail("Invalid Driver")
		elif not ledConfig.id in self._contClasses:
			return fail("Invalid Controller")

		self._driverCfg = driverConfig
		self.driver = self._driverClasses[driverConfig.id](**(driverConfig.config))
		self._ledCfg = ledConfig
		cfg = ledConfig.config
		cfg['driver'] = self.driver
		self.led = self._contClasses[ledConfig.id](**(cfg))
		return success()

	def stopConfig(self):
		if self.driver:
			self.driver.cleanup()
			self.driver = None
			self._driverCfg = None
		if self.led:
			self.led.cleanup()
			self.led = None
			self._ledCfg = None
			









