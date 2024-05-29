# Define the function to create and print the story
def create_story(name, villain, place):
    story = (
        f"Once upon a time in the land of {place}, there was a brave hero named {name}. "
        f"One day, {name} heard about the evil {villain} who was causing trouble in {place}. "
        f"Determined to save the land, {name} set out on a journey to confront {villain}. "
        f"After many challenges and adventures, {name} finally defeated {villain} and brought peace to {place}. "
        f"The people of {place} celebrated {name}'s bravery, and {name} became a legend for generations to come."
    )
    print(story)

# Ask the user to input a name, a villain, and a place
name = input("Enter a name: ")
villain = input("Enter a villain: ")
place = input("Enter a place: ")

# Call the function to create and print the story using the user's inputs
create_story(name, villain, place)