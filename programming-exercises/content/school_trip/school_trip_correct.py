coach_capacity = 45

total_people = int(input("Enter the total number of people going on the trip: "))
full_coaches = total_people // coach_capacity
leftover_people = total_people % coach_capacity

# Print the results
print("Number of full coaches needed:",full_coaches)
print("Number of people on the partly full coach:",leftover_people)