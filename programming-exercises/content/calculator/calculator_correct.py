def add(a, b):
    return a + b

def subtract(a, b):
    return a - b

def multiply(a, b):
    return a * b

def divide(a, b):
    if b != 0:
        return a / b
    else:
        return "Error! Division by zero."

def get_numbers():
    a = float(input("Enter the first number: "))
    b = float(input("Enter the second number: "))
    return a, b

while True:
    # Ask the user to choose an operation or type "stop" to exit
    choice = input("Choose an operation (add, subtract, multiply, divide) or type 'stop' to exit: ").strip().lower()

    if choice == "stop":
        print("Exiting the calculator. Goodbye!")
        break
        
    result = None
    if choice == "add":
        a, b = get_numbers()
        result = add(a, b)
    elif choice == "subtract":
        a, b = get_numbers()
        result = subtract(a, b)
    elif choice == "multiply":
        a, b = get_numbers()
        result = multiply(a, b)
    elif choice == "divide":
        a, b = get_numbers()
        result = divide(a, b)
    else:
        print("Invalid choice. Please try again.")

    if result != None:
        print(f"Result: {result}")