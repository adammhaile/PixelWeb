from bibliopixel import *
from bibliopixel.drivers.visualizer import *
from bibliopixel.drivers.serial_driver import *
import bibliopixel.colors as colors
import bibliopixel.gamma as gamma

import bibliopixel.log as log
log.setLogLevel(log.DEBUG)


# driver = DriverSerial(num=16, type=LEDTYPE.LPD8806)
# led = LEDStrip(driver)
# driver.cleanup()

with DriverSerial(num=16, type=LEDTYPE.LPD8806) as driver:
	led = LEDStrip(driver)

