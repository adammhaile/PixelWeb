import bibliopixel.led as led

controllers = [
	led
]

import bibliopixel.drivers.visualizer as visualizer
import bibliopixel.drivers.serial_driver as serial_driver
drivers = [
	visualizer,
	serial_driver
]

moduleList = []
moduleList.extend(controllers)
moduleList.extend(drivers)