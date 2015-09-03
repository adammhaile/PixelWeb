import bottle
import json

from bottle import *
from actions import *

import config
import status

import bibliopixel.log as log

@route('/')
def home():
	return static_file("gui.html", root='')

@route('/js/<filename:path>')
def send_js(filename):
    return static_file(filename, root='js')

@route('/css/<filename:path>')
def send_css(filename):
    return static_file(filename, root='css')

@route('/<filename:path>')
def send_root(filename):
    return static_file(filename, root='')

@route('/api')
def postonly():
	return "Please use POST JSON API calls only."

def doAPI(req):
	try:
		if req and'action' in req:
			if req['action'] in actions:
				action = actions[req['action']]
				params = action[1][:]
				valid = True
				missing = []
				for p in params:
					if not p in req:
						valid = False
						missing.append(p)

				if not valid:
					return fail("Missing parameters.", data=missing)

				return action[0](req)

			else:
				return fail("Invalid action.")
		else:
			return fail("Invalid request data.")
	except Exception, e:
		return fail(traceback.format_exc(), error=ErrorCode.GENERAL_ERROR, data=None)
@route('/api', method='POST')
def api():
	req = d(request.json)
	result = doAPI(req)
	if not result.status:
		status.pushError(result.msg)
	return result


config.initConfig()
status.pushStatus("Reading server config")
server = config.readServerConfig()
config.writeServerConfig(server)

cfg = d(server)
level = log.INFO
if cfg.show_debug: level = log.DEBUG
log.setLogLevel(level)

initBPM()
status.pushStatus("BiblioPixel Init Complete")
run(host=server.host, port=server.port, reloader=False)
