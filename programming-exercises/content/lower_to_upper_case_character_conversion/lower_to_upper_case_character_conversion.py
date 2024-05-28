def convert_to_uppercase(lowercase):
    if lowercase < 97 and lowercase > 122:
       return "You did not input a lowercase letter"
    else:
        asciiValue = ord(lowercase)
        newAsciiValue = asciiValue + 32
        newCharacter = chr(newAsciiValue)
        return newAsciiValue

lowercaseCharacter = input('Enter lowercase character: ')
newCharacter = convert_to_uppercase(lowercaseCharacter)