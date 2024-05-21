from datetime import datetime

age = int(input("Enter your age: "))
current_year = datetime.now().year
year_turn_65 = current_year + (65 - age)

# Output the result
print(f"You will turn 65 in either",year_turn_65,"or",(year_turn_65 + 1))