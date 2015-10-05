import os
from subprocess import Popen, PIPE

def runCommand(cmd):
    cmd_list = cmd.split(' ')
    process = Popen(cmd_list, stdout=PIPE)
    output, err = process.communicate()
    exit_code = process.wait()
    return (err, exit_code, output)

def getInstalledPackages():
    err, code, output = runCommand('pip freeze')
    res = {}
    if code == 0:
        output = output.replace("\n", "").split("\r")
        for i in output:
            if i != '':
                mod, ver = i.split("==")
                res[mod] = ver
    return res

print getInstalledPackages()
