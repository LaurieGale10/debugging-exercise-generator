# CIRCLE CALCULATION

# Imports
import math

# Input
print("Input a radius (float):")
circleRadius = math.radians(float(input())) #Need to convert circle radius to radians

circleCircumference = 2.0*math.pi*circleRadius
circleArea = math.pi*circleRadius**2

print("Circumference of the circle is", circleCircumference)
print("Area of the circle is", circleArea)