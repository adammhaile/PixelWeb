from util import *
import traceback, sys
import status

import bibliopixel.log as log

from bpmanager import *
bpm = None

def initBPM(server_config):
	global bpm
	bpm = BPManager()
	bpm.loadBaseMods()
	bpm.loadMods()
	cfg = config.readConfig("current_setup")
	if "controller" in cfg and "driver" in cfg and server_config.load_defaults:
		bpm.startConfig(cfg.driver, cfg.controller)

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
	return success({"drivers":bpm.drivers, "names":bpm._driverNames})

def getControllers(req):
	return success({"controllers":bpm.controllers, "names":bpm._contNames})

def getAnims(req):
	return success({"anims":bpm.anims, "run":bpm.animRunParams, "names":bpm._animNames})

def startConfig(req):
	try:
		result = bpm.startConfig(req['drivers'], req['controller'])
		if result.status:
			return success()
		else:
			return result
	except:
		return fail(traceback.format_exc(), error=ErrorCode.BP_ERROR, data=None)

def startAnim(req):
	try:
		result = bpm.startAnim(req['config'])
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
	cfg = d(req["config"])
	level = log.INFO
	if cfg.show_debug: level = log.DEBUG
	log.setLogLevel(level)
	return success()

def getStatus(req):
	return success(data=status.dumpStatus())

def getErrors(req):
	return success(data=status.dumpErrors())

def savePreset(req):
	cfg = config.readConfig("presets", key=req.type)
	cfg[req.name] = req.data
	config.writeConfig("presets", cfg, key=req.type)
	return success()

def getPresets(req):
	if "type" not in req:
		req.type = None
	cfg = config.readConfig("presets", key=req.type)
	return success(data=cfg)


actions = {
	'setColor' : [setColor, ['color']],
	'setBrightness' : [setBrightness, ['level']],
	'getDrivers' : [getDrivers, []],
	'getControllers' : [getControllers, []],
	'getAnims' : [getAnims, []],
	'startConfig': [startConfig, ['drivers', 'controller']],
	'startAnim': [startAnim, ['config']],
	'stopAnim': [stopAnim, []],
	'getConfig': [getConfig, []],
	'getServerConfig': [getServerConfig, []],
	'saveServerConfig': [saveServerConfig, ["config"]],
	'getStatus': [getStatus, []],
	'getErrors': [getErrors, []],
	'savePreset': [savePreset, ['type', 'name', 'data']],
	'getPresets': [getPresets, []]
}
