from bibliopixel import *
# from bibliopixel.drivers.visualizer import *
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
	def __init__(self, num):
		#self.driver = DriverVisualizer(num=num, stayTop=True)
		self.driver = DriverSerial(LEDTYPE.NEOPIXEL, 8*8*6, c_order=ChannelOrder.GRB, gamma=gamma.NEOPIXEL)
		self.led = LEDStrip(self.driver, threadedUpdate=True)

bpm = None

def initBPM(num):
	global bpm
	bpm = BPManager(num)

fillColor = (0,0,0)
def setColor(req):
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