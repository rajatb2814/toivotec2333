import os
import time
import subprocess
import argparse
from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

class Watcher:
    def __init__(self, directory_to_watch, app_name):
        self.DIRECTORY_TO_WATCH = directory_to_watch
        self.APP_NAME = app_name
        self.MANAGE_PY_DIR = os.path.abspath(os.path.join(directory_to_watch, '../../../../../'))
        self.observer = Observer()

    def run(self):
        event_handler = Handler(self.APP_NAME, self.MANAGE_PY_DIR)
        self.observer.schedule(event_handler, self.DIRECTORY_TO_WATCH, recursive=True)
        self.observer.start()
        print(f"watching for file changes in {self.DIRECTORY_TO_WATCH} ⚡️⚡️⚡️")
        try:
            while True:
                time.sleep(5)
        except KeyboardInterrupt:
            self.observer.stop()
        self.observer.join()

class Handler(FileSystemEventHandler):
    def __init__(self, app_name, manage_py_dir):
        super().__init__()
        self.app_name = app_name
        self.manage_py_dir = manage_py_dir

    def on_any_event(self, event):
        if event.is_directory:
            return None
        elif event.event_type == 'modified':
            # Change to the directory containing manage.py
            print(f"Detected change in {event.src_path}.")
            print(f"Running sync and collectstatic ✨✨✨")
            os.chdir(self.manage_py_dir)
            # Run the Django management commands
            subprocess.call(f"python manage.py sync_static {self.app_name} && python manage.py collectstatic --noinput", shell=True)
            print(f"Static files updated 😎😎😎")

if __name__ == '__main__':
    parser = argparse.ArgumentParser(description="Watch a directory and run sync_static and collectstatic when files change.")
    parser.add_argument('--directory', type=str, required=True, help="The directory to watch for changes.")
    parser.add_argument('--app-name', type=str, required=True, help="The Django app name to pass to sync_static.")

    args = parser.parse_args()

    print(f"starting file watcher 🚀🚀🚀")

    watcher = Watcher(args.directory, args.app_name)
    watcher.run()
