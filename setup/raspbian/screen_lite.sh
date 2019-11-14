#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

# remove mouse pointer
sed -i "/#xserver-command=X/c\xserver-command=X -s 0 dpms -nocursor" /etc/lightdm/lightdm.conf

cp -r ./screens /etc/xdg/openbox

# 10"
echo "/etc/xdg/openbox/screens/10_inch.sh" > /etc/xdg/openbox/autostart
