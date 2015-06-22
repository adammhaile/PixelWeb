from bibliopixel import *
from bibliopixel.drivers.visualizer import *
from matrix_animations import *
import time

driver = DriverVisualizer(width=10, height=10, stayTop = True)

led = LEDMatrix(driver, threadedUpdate=False)

index = 0
anims = []
def callback(anim):
	global index
	print anim
	a = anims[index]
	index += 1
	if index >= len(anims):
		index = 0
	a.run(fps=30, max_steps=60, callback=callback, threaded = True)


anims.append(Bloom(led))
anims.append(MatrixRain(led))

callback(None)
#anim.run(fps=30, max_steps=15, callback=callback)

while True:
	time.sleep(1)
