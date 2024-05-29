# Define the first subroutine to ask for the user's name
def ask_name():
    name = input("What is your name? ")
    print("Hello there,",name)

# Define the second subroutine to ask for the user's age
def ask_age():
    age = input("What is your age? ")
    print(age,"is a good age to be")

# Define the third subroutine to ask for the user's favourite colour
def ask_favourite_colour():
    colour = input("What is your favourite colour? ")
    print(colour,"is definitely a nice colour")

# Call the subroutines to execute them
ask_name()
ask_age()
ask_favourite_colour()