#!/bin/sh

set -e

if [ "$(id -u)" != 0 ]
  then echo "Please run as root"
  exit
fi

# remove mouse pointer
sed -i "/#xserver-command=X/c\xserver-command=X -s 0 dpms -nocursor" /etc/lightdm/lightdm.conf

mv /etc/xdg/autostart/arandr-autostart.desktop /etc/xdg/autostart/arandr-autostart.desktop.backup
cp ./screens /etc/xdg/lxsession/LXDE-pi

# 10"
echo "@sh /etc/xdg/lxsession/LXDE-pi/screens/10_inch.sh" > /etc/xdg/lxsession/LXDE-pi/autostart
