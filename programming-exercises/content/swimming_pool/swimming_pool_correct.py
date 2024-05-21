
RATE_OF_FLOW  = 2.5
METRES_2_LITRES = 1000.0
SECONDS_2_HOURS = 1.0/3600.0
    
# Input 
lengthOfPool = int(input("Enter length of pool: "))
widthOfPool  = int(input("Enter width of pool: "))
depthOfPool  = int(input("Enter depth of pool: "))

volumeOfPoolInLitres = lengthOfPool * widthOfPool * depthOfPool * METRES_2_LITRES
timeToFillPool = (volumeOfPoolInLitres/RATE_OF_FLOW) * SECONDS_2_HOURS

print(f"Volume in Litres = {timeToFillPool}")
print(f"Time to fill pool = {timeToFillPool}")