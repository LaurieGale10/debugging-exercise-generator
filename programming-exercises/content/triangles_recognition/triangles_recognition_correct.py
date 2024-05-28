print('Input three sides of a triangle:')
sideA = int(input())
sideB = int(input())
sideC = int(input())

if (sideA + sideB > sideC) and (sideA + sideC > sideB) and (sideB + sideC > sideA):
    if sideA == sideB == sideC:
        print('Triangle is an equilateral')
    elif sideA == sideB or sideA == sideC or sideB == sideC:
        print('Triangle is an isosceles triangle')
    else:
        print('TRIANGLE is an scalene triangle')
else:
    print('Not a valid triangle')
	