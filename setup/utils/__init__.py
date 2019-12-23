'Script utilities'

from os import geteuid, getlogin, path
from sys import executable, version
from shutil import unpack_archive


def print_env():
    print('Python version', version)
    print('Python executable', executable)
    print('userid', geteuid())
    print('username', getlogin())


def assert_sudo():
    assert geteuid() == 0, 'Please run as sudo'


def assert_file(file):
    assert path.isfile(file), f'{file} does not exist'


def extract_file(file, target=None):
    unpack_archive(file, target)
