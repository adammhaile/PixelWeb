import traceback, sys

from bibliopixel import *
import bibliopixel.drivers.visualizer as driver_visualizer
from bibliopixel.drivers.serial_driver import *
import bibliopixel.colors as colors
import bibliopixel.gamma as gamma

import bibliopixel.log as log
log.setLogLevel(log.DEBUG)

class ErrorCode:
	SUCCESS = 0
	GENERAL_ERROR = 1

def fail(msg, error = ErrorCode.GENERAL_ERROR, data=None):
	return {"status" : False, "msg" : msg, "error_code" : error, "data" : data}

def success(data):
	return {"status" : True, "msg" : "OK", "error_code" : ErrorCode.SUCCESS, "data" : data}

class BPManager(object):
	def __init__(self, config):

		driverTypes = {
			"DriverVisualizer": DriverVisualizer,
			"DriverSerial": DriverSerial
		}

		controllerTypes = {
			"LEDStrip" : LEDStrip,
			"LEDMatrix": LEDMatrix
		}

		try:
			controllerConfig = config['controller']
			controllerType = controllerConfig['type']
			controllerParams = controllerConfig['params']

			driverConfig = config['driver']
			driverType = driverConfig['type']
			driverParams = driverConfig['params']
		except KeyError, e:
			raise Exception("Error loading config: " + e)

		self.led = None
		self.driver = None
		try:
			if driverType in driverTypes:
				self.driver = driverTypes[driverType](**driverParams)
			else:
				raise Exception("Invalid Driver Type")

			controllerParams['driver'] = self.driver
			if controllerType in controllerTypes:
				self.led = controllerTypes[controllerType](**controllerParams)
			else:
				raise Exception("Invalid Controller Type")
		except Exception, e:
			raise e

bpm = None

def initBPM(config):
	global bpm
	bpm = BPManager(config)

fillColor = (0,0,0)
def setColor(req):
	global fillColor
	fillColor = colors.hex2rgb(req['color'])
	bpm.led.fill(fillColor)
	bpm.led.update()
	return success(None)

def setBrightness(req):
	try:
		bpm.led.setMasterBrightness(req['level'])
		bpm.led.fill(fillColor)
		bpm.led.update()
	except Exception, e:
		return fail(msg = e.message)
	return success(None)

moduleList = [
	driver_visualizer
]

_driverClasses = {}
_driverList = {}
_loadedDriver = None

def loadDriverDef(config):
	_driverClasses[config['id']] = config['class']
	c = {"display":config['display'], "params":config['params']}
	_driverList[config['id']] = c

loadFuncs = {
	"driver" : loadDriverDef
}

def loadModules():
	for m in moduleList:
		if hasattr(m, 'MANIFEST'):
			for ref in m.MANIFEST:
				if ref['type'] in loadFuncs:
					loadFuncs[ref['type']](ref)


def getDrivers(req):
	return success(_driverList)

def startDriver(req):
	driver = req['id']
	config = req['config']
	global _loadedDriver
	try:
		if _loadedDriver:
			_loadedDriver.cleanup()
		_loadedDriver = _driverClasses[driver](**config)
		return success(None)
	except Exception, e:
		return fail(traceback.format_exc(), error=ErrorCode.GENERAL_ERROR, data=None)


actions = {
	'setColor' : [setColor, ['color']],
	'setBrightness' : [setBrightness, ['level']],
	'getDrivers' : [getDrivers, []],
	'startDriver': [startDriver, []]
}