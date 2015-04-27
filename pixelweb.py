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


initBPM(30)

run(host='0.0.0.0', port=8080, reloader=False)