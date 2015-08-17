from bibliopixel import log
from collections import deque

errorQ = deque(maxlen=100)
statusQ = deque(maxlen=100)

def pushStatus(msg):
    statusQ.append(msg)
    log.logger.info(msg)

def dumpStatus():
    res = list(statusQ)
    statusQ.clear()
    return res

def pushError(error):
    errorQ.append(error)
    log.logger.error(error)

def dumpErrors():
    res = list(errorQ)
    errorQ.clear()
    return res
