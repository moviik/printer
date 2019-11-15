#!/bin/sh
set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

echo "@midnight root /sbin/reboot" > /etc/cron.d/midnight_reboot