from bibliopixel import *
from bibliopixel.drivers.visualizer import *
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
		driverConfig = config['driver']
		driverType = driverConfig['type']
		params = driverConfig['params']
		self.driver = None
		try:
			if driverType in driverTypes:
				self.driver = driverTypes[driverType](**params)

			self.led = LEDStrip(self.driver, threadedUpdate=True)
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

actions = {
	'setColor' : [setColor, ['color']],
	'setBrightness' : [setBrightness, ['level']],
}