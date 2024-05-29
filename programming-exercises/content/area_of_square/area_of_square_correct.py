# Define a function to calculate and return the area of a square
def calculate_square_area(side_length):
    return side_length * side_length

# Ask the user to input the length of a side in a square
side_length = float(input("Enter the length of a side in the square: "))

# Call the function to calculate the area of the square
area = calculate_square_area(side_length)

# Print the calculated area
print("The area of the square with side length "+str(side_length)+" is: "+str(area))
