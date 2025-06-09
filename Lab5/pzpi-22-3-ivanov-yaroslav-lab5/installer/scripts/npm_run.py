# filepath: c:\Users\Yaroslav\Documents\GitHub\apz-pzpi-22-3-ivanov-yaroslav\Lab5\pzpi-22-3-ivanov-yaroslav-lab5\installer\scripts\npm_run.py
import sys
import subprocess
import os

def get_server_dir():
    if getattr(sys, 'frozen', False):
        return os.path.abspath(os.path.join(os.path.dirname(sys.executable), '..', '..', 'server'))
    else:
        return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', 'server'))

def get_client_apz_dir():
    if getattr(sys, 'frozen', False):
        return os.path.abspath(os.path.join(os.path.dirname(sys.executable), '..', '..', 'client', 'apz'))
    else:
        return os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..', '..', 'client', 'apz'))

def start_npm_dev_server(server_directory):
    if not os.path.isdir(server_directory):
        raise Exception(f"Server directory does not exist: {server_directory}")
    subprocess.Popen(
        'cmd /k "npm run dev"',
        cwd=server_directory,
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )

def start_npm_client_dev(client_apz_directory):
    if not os.path.isdir(client_apz_directory):
        raise Exception(f"Client apz directory does not exist: {client_apz_directory}")
    subprocess.Popen(
        'cmd /k "npm run dev"',
        cwd=client_apz_directory,
        creationflags=subprocess.CREATE_NEW_CONSOLE
    )