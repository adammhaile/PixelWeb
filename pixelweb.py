import bottle
import json

from bottle import *
from actions import *

@route('/')
def home():
	return static_file("index.html", root='')

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

@route('/api', method='POST')
def api():
	req = request.json
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


def loadConfig():
	error = None
	try:
		with open("config.json", mode="r") as f:
			try:
				config = json.load(f)
				return config
			except ValueError:
				error = "Error loading config. Try validating your config JSON @ http://jsonlint.com/"
	except Exception, e:
		error = e
	return {"error": error}

config = loadConfig()
if "error" in config:
	print config['error']
else:
	initBPM(config)
	serverConfig  = config['server']
	run(host=serverConfig['host'], port=serverConfig['port'], reloader=False)