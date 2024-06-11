import random

random_list = [random.randint(1,100), random.randint(1,100), random.randint(1,100)]
print("Initial random list:", random_list)
user_input = int(input("Please enter an integer: "))
random_list.append(user_input)
random_list.sort()
print("Updated list:", random_list)