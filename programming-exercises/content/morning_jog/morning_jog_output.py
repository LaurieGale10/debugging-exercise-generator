current_distance = 5.0
required_distance = 10.0

# Initialise the day counter
days = 0

# Loop until the current distance reaches or exceeds the required distance
while current_distance < required_distance:
    # Increase the day counter
    days += 1
    # Increase the distance by 10%
    current_distance *= 1.1
print("The number of days required to train is",days)