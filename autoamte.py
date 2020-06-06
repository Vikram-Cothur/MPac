import os
from sys import platform
if platform == "win32":
    commit_msg = input("COMMIT MESSAGE:")
    os.chdir(r"D:\MiscProjects\Game Projects JS\ZaPac")
    os.system("git add .")
    os.system(f"git commit -m {commit_msg}")
    os.system("git push origin master")
