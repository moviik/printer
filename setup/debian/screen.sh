#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

# remove mouse pointer
sed -i '/#xserver-command=X/c\xserver-command=X -core -nocursor' /usr/share/lightdm/lightdm.conf.d/50-xserver-command.conf

cp -r ../screens /etc/xdg

cp screen-autostart.desktop /etc/xdg/autostart
