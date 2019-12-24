'Script to setup cron jobs'

from os import system
from utils import assert_sudo

def crontab():
    assert_sudo()

    cron_file = open('/etc/cron.d/midnight_reboot', 'a')
    cron_file.writelines(['@midnight root /sbin/reboot'])
    cron_file.close()
