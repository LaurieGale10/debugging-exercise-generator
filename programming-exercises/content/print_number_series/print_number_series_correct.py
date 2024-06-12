# Input integers A and B
A = int(input("Enter the first integer (A): "))
B = int(input("Enter the second integer (B): "))

if A < B:
    for i in range(A, B + 1):
        print(i, end=' ')
else:
    for i in range(A, B - 1, -1):
        print(i, end=' ')