# LOWER TO UPPER CASE CONVERSION

character = input('Enter lowercase character: ')
asciiValue = ord(character)
newAsciiValue = asciiValue-32
newCharacter = chr(newAsciiValue)
print("Lower case "+ character+"("+asciiValue+") -> upper case "+newCharacter+" ("+newAsciiValue+")")