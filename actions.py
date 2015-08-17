from util import *
import traceback, sys
import status

import bibliopixel.log as log
log.setLogLevel(log.DEBUG)

from bpmanager import *
bpm = None

def initBPM():
	global bpm
	bpm = BPManager()
	bpm.loadModules()
	bpm.loadAnimations()

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
		return fail(traceback.format_exc(), error=ErrorCode.BP_ERROR, data=None)
	return success(None)


def getDrivers(req):
	return success(bpm.drivers)

def getControllers(req):
	return success(bpm.controllers)

def getAnims(req):
	return success({"anims":bpm.anims, "run":bpm.animRunParams})

def startConfig(req):
	try:
		status.pushStatus("Starting Config")
		result = bpm.startConfig(req['drivers'], req['controller'])
		if result.status:
			return success()
		else:
			return result
	except:
		return fail(traceback.format_exc(), error=ErrorCode.BP_ERROR, data=None)

def startAnim(req):
	try:
		status.pushStatus("Starting Animation")
		result = bpm.startAnim(req['config'], req['run'])
		if result.status:
			return success()
		else:
			return result
	except:
		return fail(traceback.format_exc(), error=ErrorCode.BP_ERROR, data=None)

def stopAnim(req):
	bpm.stopAnim()
	return success()

def getConfig(req):
	return success(bpm.getConfig())

def getServerConfig(req):
	return success({
		"setup":config.BASE_SERVER_CONFIG,
		"config":{
			"id": "server_config",
			"config": config.readServerConfig()
			}
		})

def saveServerConfig(req):
	config.writeServerConfig(req["config"])
	return success()

def getStatus(req):
	return success(data=status.dumpStatus())

def getErrors(req):
	return success(data=status.dumpErrors())


actions = {
	'setColor' : [setColor, ['color']],
	'setBrightness' : [setBrightness, ['level']],
	'getDrivers' : [getDrivers, []],
	'getControllers' : [getControllers, []],
	'getAnims' : [getAnims, []],
	'startConfig': [startConfig, ['drivers', 'controller']],
	'startAnim': [startAnim, ['config', 'run']],
	'stopAnim': [stopAnim, []],
	'getConfig': [getConfig, []],
	'getServerConfig': [getServerConfig, []],
	'saveServerConfig': [saveServerConfig, ["config"]],
	'getStatus': [getStatus, []],
	'getErrors': [getErrors, []],
}
