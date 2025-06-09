import getpass
    
# Prompts the user to enter the database password and checks if it is correct
def check_database_password():
    correct_password = 'alLxYV4BL6MvP00z'
    while True:
        entered_password = getpass.getpass("Enter database password: ")
        if entered_password != correct_password:
            print("Incorrect password. Try again.")
        else:
            print("Password is correct.\n")
            break