# Pythagoras Version I

import math

print('Input opposite and adjacent sides of a right angled triangle')
opposite = float(input())
adjacent = float(input())

hypotenuse = math.sqrt((opposite**2)+(adjacent**2))
print('Given:  opposite = {0:3f}, adjacent = {0:3f}'.format(opposite,adjacent))
print('Result: hypotenuse = {0:3f}'.format(hypotenuse))
	