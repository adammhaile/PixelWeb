from bibliopixel import log

def pushStatus(msg):
    log.logger.info(msg)

def pushError(error):
    log.logger.error(error)