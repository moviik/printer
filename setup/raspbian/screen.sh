#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

sed -i "/#xserver-command=X/c\xserver-command=X -s 0 dpms" /etc/lightdm/lightdm.conf