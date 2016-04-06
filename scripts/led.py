import sys
import argparse
import time
import pigpio

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('integers', type=int, nargs='+',
                           help='an integer for the accumulator')
args = parser.parse_args()
red = args.integers[0]
green = args.integers[1]
blue = args.integers[2]

pi = pigpio.pi()
try:
    redCurrent = int(pi.get_PWM_dutycycle(17))
    greenCurrent = int(pi.get_PWM_dutycycle(22))
    blueCurrent = int(pi.get_PWM_dutycycle(24))
except:
    redCurrent = 255
    greenCurrent = 255
    blueCurrent = 255
    pass
delay = 0.005

while (redCurrent != red) or (greenCurrent != green) or (blueCurrent != blue):
    time.sleep(delay)

    if redCurrent < red:
        redCurrent += 1
    elif redCurrent > red:
        redCurrent -= 1

    pi.set_PWM_dutycycle(17, redCurrent)

    if greenCurrent < green:
        greenCurrent += 1
    elif greenCurrent > green:
        greenCurrent -= 1

    pi.set_PWM_dutycycle(22, greenCurrent)

    if blueCurrent < blue:
        blueCurrent += 1
    elif blueCurrent > blue:
        blueCurrent -= 1

    pi.set_PWM_dutycycle(24, blueCurrent)

