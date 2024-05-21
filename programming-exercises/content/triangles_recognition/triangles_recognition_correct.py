# Global variables
longSide   = 0
shortsideA = 0
shortsideB = 0
	    
# Function to identify equilateral, isosceles triangles and scalene 
# triangles
def equilatralOrIsosceles() :
	if (shortsideA == shortsideB) :
		if (shortsideB == longSide) :
			print('Triangle is an equilateral')
		else :
			print('TRIANGLE is an isosceles triangle')
	else :
		if (shortsideA == longSide or shortsideB == longSide) :
			print('TRIANGLE is an isosceles triangle')
		else :
			print('TRIANGLE is an scalene triangle')
	    	
# Start
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
	