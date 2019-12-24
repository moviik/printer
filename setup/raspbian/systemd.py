'Script to install systemd services'

from shutil import copy, copy2, copytree, copymode
from utils import assert_sudo, home_dir


def systemd():
    assert_sudo()
    home = home_dir()

    copy('./raspbian/mik-dispenser.service', '/etc/systemd/system')
    copy('./raspbian/mik-printer.service', '/etc/systemd/system')

    copytree(f'{home}/mik-printer', '/usr/local/bin/')
    # copytree(f'{home}/mik-dispenser', '/usr/local/bin')
    # copytree(f'{home}/node-v10.11.0-linux-armv7l', '/usr/local/bin')

    copymode(f'{home}/mik-printer', '/usr/local/bin/mik-printer')
    # copymode(f'{home}/mik-dispenser', '/usr/local/bin/mik-dispenser')
    # copymode(f'{home}/node-v10.11.0-linux-armv7l', '/usr/local/bin/node-v10.11.0-linux-armv7l')
