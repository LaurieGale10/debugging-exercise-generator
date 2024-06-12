numbers = []

print("Enter five unique integers:")
for _ in range(5):
    num = int(input())
    numbers.append(num)

# Find the indices of the minimum and maximum elements
min_index = numbers.index(min(numbers))
max_index = numbers.index(max(numbers))

# Swap the minimum and maximum elements
numbers[min_index], numbers[max_index] = numbers[max_index], numbers[min_index]

print("Resulting list after swapping the minimum and maximum elements:", numbers)