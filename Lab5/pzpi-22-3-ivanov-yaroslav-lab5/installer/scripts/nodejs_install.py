import os
import sys
import requests
import subprocess
import winreg

NODEJS_PATH = r'C:\Program Files\nodejs'
NODEJS_VERSION = "20.15.0"

# Adds Node.js installation path to the system PATH environment variable
def add_nodejs_to_path():
    if NODEJS_PATH not in os.environ['PATH']:
        os.environ['PATH'] += os.pathsep + NODEJS_PATH
    else:
        print(f"'{NODEJS_PATH}' is already in PATH.\n")

# Checks if Node.js is already installed on the system
def is_nodejs_installed():
    add_nodejs_to_path()
    try:
        print("Checking if Node.js is installed")
        node_version = subprocess.check_output(['node', '--version'], stderr=subprocess.STDOUT, text=True, shell=True).strip()
        print(f"Node.js is already installed. Version: {node_version}\n")
        return True
    except (FileNotFoundError, subprocess.CalledProcessError):
        print("Node.js is not installed.\n")
        return False

# Downloads the Node.js installer for the specified version
def download_nodejs_installer(version=NODEJS_VERSION):
    url = f"https://nodejs.org/dist/v{version}/node-v{version}-x64.msi"
    file_name = f"node-v{version}-x64.msi"
    print(f"Downloading Node.js {version}")

    response = requests.get(url, stream=True)
    response.raise_for_status()
    
    with open(file_name, "wb") as file:
        for chunk in response.iter_content(chunk_size=8192):
            file.write(chunk)
    print(f"Node.js installer {file_name} downloaded successfully.\n")
    return file_name

# Installs Node.js from the downloaded MSI installer
def install_nodejs_from_msi(file_name):
    print(f"Installing {file_name}\n")
    try:
        process = subprocess.Popen(
            ["msiexec", "/i", file_name, "/quiet", "/norestart"],
            shell=True,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE
        )
        stdout, stderr = process.communicate()
        if process.returncode == 0:
            print("Installation done successfully.\n")
        else:
            error_message = stderr.decode().strip()
            print(f"Installation error: {error_message}", file=sys.stderr)
            raise Exception(f"msiexec returned exit code {process.returncode}")
    except Exception as e:
        print(f"Installation error: {e}", file=sys.stderr)
        raise

# Retrieves the system and user PATH environment variables
def get_system_and_user_path():
    try:
        with winreg.OpenKey(winreg.HKEY_CURRENT_USER, r'Environment') as key:
            user_path, _ = winreg.QueryValueEx(key, 'Path')
    except FileNotFoundError:
        user_path = ''

    try:
        with winreg.OpenKey(winreg.HKEY_LOCAL_MACHINE, r'SYSTEM\CurrentControlSet\Control\Session Manager\Environment') as key:
            system_path, _ = winreg.QueryValueEx(key, 'Path')
    except FileNotFoundError:
        system_path = ''

    return system_path + ';' + user_path if user_path and system_path else system_path or user_path

# Updates the PATH environment variable with the system and user PATH
def update_environment_path():
    try:
        full_path = get_system_and_user_path()
        os.environ['PATH'] = full_path
        print("Environment path has been updated.\n")
    except Exception as e:
        print(f"Failed to update environment path: {e}", file=sys.stderr)
        raise

# Verifies if Node.js is installed correctly by checking its version
def verify_nodejs_installation():
    try:
        result = subprocess.check_output(["node", "-v"], shell=True, text=True)
        print(f"Node.js is installed: version {result.strip()}\n")
    except (FileNotFoundError, subprocess.CalledProcessError) as e:
        print(f"Error during Node.js installation: {e}", file=sys.stderr)

# Downloads and installs Node.js, then updates the environment PATH
def install_nodejs(version=NODEJS_VERSION):
    try:
        file_name = download_nodejs_installer(version)
        install_nodejs_from_msi(file_name)
        update_environment_path()
        add_nodejs_to_path()
        verify_nodejs_installation()
    except Exception as e:
        print(f"An error occurred: {e}", file=sys.stderr)
        sys.exit(1)

# Runs the Node.js setup process if Node.js is not already installed
def run_nodejs_setup():
    if not is_nodejs_installed():
        install_choice = input("Install Node.js? [yes/no]: ").strip().lower()
        if install_choice == 'y':
            install_nodejs()
        else:
            print("Node.js not installed. Exiting.")
            sys.exit(1)
    else:
        print("Proceeding with the project setup")