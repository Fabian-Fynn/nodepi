import sys
import RPi.GPIO as GPIO
GPIO.setmode(GPIO.BOARD)
GPIO.setup(17, GPIO.OUT)
if(len(sys.argv) > 1):
    GPIO.output(17, True)
else:
    GPIO.output(17, False)
