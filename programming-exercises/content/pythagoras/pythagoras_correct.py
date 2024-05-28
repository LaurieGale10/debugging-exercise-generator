import math

opposite = float(input('Input the opposite side of a right angled triangle '))
adjacent = float(input('Input the adjacent side of a right angled triangle '))

hypotenuse = math.sqrt((opposite**2)+(adjacent**2))
print(f'Given:  opposite = {opposite}, adjacent = {adjacent}')
print(f'Result: hypotenuse = {hypotenuse}')
	