import sys
import subprocess
import os

# Installs npm dependencies in the server directory
def get_server_dir():
    # Если запущено из exe, ищем server на уровень выше папки с exe
    if getattr(sys, 'frozen', False):
        # exe лежит в dist, а server — на два уровня выше
        return os.path.abspath(os.path.join(os.path.dirname(sys.executable), '..', '..', 'server'))
    else:
        # если из исходников — на два уровня выше installer/scripts
        return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server'))

def install_npm_dependencies(server_directory):
    print(f"Running 'npm install' in {server_directory}...")
    if not os.path.isdir(server_directory):
        raise Exception(f"Server directory does not exist: {server_directory}")
    result = subprocess.run("npm install", cwd=server_directory, check=True, text=True, capture_output=True, shell=True)
    print("npm install run successfully:")
    print(result.stdout)

