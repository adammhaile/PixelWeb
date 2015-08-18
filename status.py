from bibliopixel import log
from collections import deque
import time

errorQ = deque(maxlen=100)
statusQ = deque(maxlen=100)

def pushStatus(msg):
    statusQ.appendleft({"msg":msg, "timestamp":time.strftime("%H:%M:%S")})
    log.logger.info(msg)

def dumpStatus():
    res = list(statusQ)
    # statusQ.clear()
    return res

def pushError(error):
    errorQ.appendleft({"msg":error, "timestamp":time.strftime("%H:%M:%S")})
    log.logger.error(error)

def dumpErrors():
    res = list(errorQ)
    # errorQ.clear()
    return res
