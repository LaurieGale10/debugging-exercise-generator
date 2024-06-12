sentence = input("Please enter a sentence: ").lower()

vowel_count = 0
vowels = "aeiou"

# Loop through each letter in the sentence
for letter in sentence:
    # Check if the letter is a vowel
    if letter in vowels:
        vowel_count += 1

print(f"The number of vowels in your sentence is: {vowel_count}")