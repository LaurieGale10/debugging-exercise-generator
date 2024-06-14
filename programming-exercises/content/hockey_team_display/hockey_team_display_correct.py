country1 = input("Enter the name of the first country: ")
country2 = input("Enter the name of the second country: ")

country1 = country1.upper()
country2 = country2.upper()

if len(country1) > 4 or country1.startswith('Z'):
    shortened_country1 = country1[:2]
else:
    shortened_country1 = country1[:3]

if len(country2) > 4 or country2.startswith('Z'):
    shortened_country2 = country2[:2]
else:
    shortened_country2 = country2[:3]

print("Team 1: ", shortened_country1)
print("Team 2: ", shortened_country2)