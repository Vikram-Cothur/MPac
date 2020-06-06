import os
from getpass import getpass
from sys import platform
from subprocess import Popen, PIPE
if platform == "win32":
    commit_msg = input("COMMIT MESSAGE:")
    os.chdir(r"D:\MiscProjects\Game Projects JS\ZaPac")
    os.system("git add .")
    os.system(f"git commit -m \"{commit_msg}\" ")
    os.system("git push origin master")
else:
    password = getpass()
    os.chdir("/root/iogames/MPac")
    os.system("git stash push")
    git = Popen('git pull origin master'.split(" "), stdin=PIPE, stdout=PIPE, stderr=PIPE, universal_newlines=True)
    git.stdin.write("fire-hound\r")
    git.stdin.write(f"{password}\r")
    git.stdin.close()
    for line in git.stdout:
        print(line.strip())
    os.system("git stash drop")
    os.system("pm2 stop index.js")
    os.system("pm2 start index.js")

