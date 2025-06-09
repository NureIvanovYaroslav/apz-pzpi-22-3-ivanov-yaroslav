import tkinter as tk
from tkinter import messagebox
from tkinter import ttk
import threading
import os
import sys
import subprocess

scripts_path = os.path.join(os.path.dirname(__file__), 'scripts')
if scripts_path not in sys.path:
    sys.path.insert(0, scripts_path)

from scripts.nodejs_install import run_nodejs_setup
from scripts.npm_install import install_npm_dependencies
from scripts.npm_run import start_npm_dev_server, start_npm_client_dev

CORRECT_PASSWORD = 'alLxYV4BL6MvP00z'
SERVER_DIR = r"C:\Users\Yaroslav\Documents\GitHub\apz-pzpi-22-3-ivanov-yaroslav\Lab2\pzpi-22-3-ivanov-yaroslav-lab2\server"
CLIENT_APZ_DIR = r"C:\Users\Yaroslav\Documents\GitHub\apz-pzpi-22-3-ivanov-yaroslav\Lab3\pzpi-22-3-ivanov-yaroslav-lab3\client\apz"

class InstallerApp(tk.Tk):
    def __init__(self):
        super().__init__()
        self.title("System Installer")
        self.geometry("400x250")
        self.resizable(False, False)
        self.password = tk.StringVar()
        self.current_frame = None
        self.switch_frame(self.create_password_frame)

    def switch_frame(self, frame_function):
        if self.current_frame:
            self.current_frame.destroy()
        self.current_frame = frame_function()

    def create_password_frame(self):
        frame = tk.Frame(self)
        frame.pack(expand=True, fill="both")

        tk.Label(frame, text="System Installer", font=("TkDefaultFont", 16, "bold")).pack(pady=(30, 8))
        tk.Label(frame, text="Database password:").pack(pady=(0, 10))
        entry = ttk.Entry(frame, show="*", textvariable=self.password, width=22)
        entry.pack()
        entry.focus()

        ttk.Button(frame, text="Next", command=self.check_password).pack(pady=28)
        return frame

    def check_password(self):
        if self.password.get() != CORRECT_PASSWORD:
            messagebox.showerror("Error", "Incorrect password.")
        else:
            self.switch_frame(self.create_progress_frame)
            threading.Thread(target=self.install_all, daemon=True).start()

    def create_progress_frame(self):
        frame = tk.Frame(self)
        frame.pack(expand=True, fill="both")
        self.status_label = tk.Label(frame, text="Installing...")
        self.status_label.pack(pady=(60, 10))
        self.progress_bar = ttk.Progressbar(frame, mode='indeterminate', length=240)
        self.progress_bar.pack(pady=20)
        self.progress_bar.start()
        return frame

    def update_status(self, message):
        self.status_label.config(text=message)
        self.update_idletasks()

    def install_all(self):
        try:
            self.update_status("Installing Node.js...")
            run_nodejs_setup()
            self.update_status("Installing npm dependencies...")
            install_npm_dependencies(SERVER_DIR)
            self.update_status("Done.")
            self.progress_bar.stop()
            self.switch_frame(self.create_success_frame)
            self.create_desktop_shortcut()
        except Exception as e:
            messagebox.showerror("Installation Failed", str(e))
            self.destroy()

    def create_success_frame(self):
        frame = tk.Frame(self)
        frame.pack(expand=True, fill="both")
        tk.Label(frame, text="Installation Complete!", font=("TkDefaultFont", 14, "bold")).pack(pady=(50, 10))
        ttk.Button(frame, text="Start Server and Frontend", command=self.launch_services).pack(pady=30)
        return frame

    def launch_services(self):
        self.start_in_new_console(lambda: start_npm_dev_server(SERVER_DIR))
        self.start_in_new_console(lambda: start_npm_client_dev(CLIENT_APZ_DIR))
        try:
            subprocess.Popen(["cmd", "/c", "start", "http://localhost:5000/docs"])
            subprocess.Popen(["cmd", "/c", "start", "http://localhost:5001"])
        except Exception as e:
            messagebox.showerror("Launch Failed", str(e))
        self.destroy()

    def start_in_new_console(self, func):
        threading.Thread(target=func, daemon=True).start()

    def create_desktop_shortcut(self):
        # См. следующий пункт!
        create_hardcoded_bat()

def create_hardcoded_bat():
    # Захардкоженные пути для вашего устройства
    desktop = os.path.join(os.path.join(os.environ['USERPROFILE']), 'Desktop')
    bat_path = os.path.join(desktop, "StartServerAndFrontend.bat")
    server_dir = r"C:\Users\Yaroslav\Documents\GitHub\apz-pzpi-22-3-ivanov-yaroslav\Lab2\pzpi-22-3-ivanov-yaroslav-lab2\server"
    client_apz_dir = r"C:\Users\Yaroslav\Documents\GitHub\apz-pzpi-22-3-ivanov-yaroslav\Lab3\pzpi-22-3-ivanov-yaroslav-lab3\client\apz"

    bat_content = f"""@echo off
cd /d "{server_dir}"
start cmd /k "npm run dev"
cd /d "{client_apz_dir}"
start cmd /k "npm run dev"
start http://localhost:5000/docs
start http://localhost:5001
"""

    with open(bat_path, "w", encoding="utf-8") as file:
        file.write(bat_content)

if __name__ == "__main__":
    app = InstallerApp()
    app.mainloop()
