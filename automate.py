import os
from getpass import getpass
from sys import platform
from subprocess import Popen, PIPE
import pexpect
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
    git = pexpect.spawn("git pull origin master")
    git.expect("Username for 'https://github.com':")
    git.sendline("fire-hound")
    git.expect("Password for 'https://fire-hound@github.com':")
    git.sendline(password)
    os.system("git stash drop")
    os.system("pm2 stop index.js")
    os.system("pm2 start index.js")

