# INPUT MENU

while True :
    # Output menu
    print('---------------------------------------------------')
    print('Select one of the following options')
    print('\t(1) Print "The floor is lava"')
    print('\t(2) Guess your favourite colour')
    print('\t(3) Print something random')
    print('\t(4) Do nothing') 
    print('\t(5) Exit')
    print('---------------------------------------------------')
    selection = int(input())
    if (selection==1) :
        print("The floor is lava")
    elif (selection==2) :
        print("Your favourite colour is ...")
    elif (selection==3) :
        print("Random string")
    elif (selection==4) :
        print("Doing nothing")
    elif (selection==5) :
        quit()
    else :
        print('ERROR 1: Unrecognised menu option')