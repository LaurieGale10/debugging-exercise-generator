import random

numbers = []
for i in range(4):
    num = float(input(f"Enter number {i + 1}: "))
    numbers.append(num)

selected_number = random.choice(numbers)

print(f"Randomly selected number: {selected_number}")